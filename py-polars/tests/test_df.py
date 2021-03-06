from pypolars import DataFrame, Series
from pypolars.datatypes import *
import pytest
from io import BytesIO
import numpy as np


def test_init():
    df = DataFrame({"a": [1, 2, 3], "b": [1.0, 2.0, 3.0]})

    # length mismatch
    with pytest.raises(RuntimeError):
        df = DataFrame({"a": [1, 2, 3], "b": [1.0, 2.0, 3.0, 4.0]})


def test_selection():
    df = DataFrame({"a": [1, 2, 3], "b": [1.0, 2.0, 3.0], "c": ["a", "b", "c"]})

    assert df["a"].dtype == Int64
    assert df["b"].dtype == Float64
    assert df["c"].dtype == Utf8

    assert df[["a", "b"]].columns == ["a", "b"]
    assert df[[True, False, True]].height == 2

    assert df[[True, False, True], "b"].shape == (2, 1)
    assert df[[True, False, False], ["a", "b"]].shape == (1, 2)

    assert df[[0, 1], "b"].shape == (2, 1)
    assert df[[2], ["a", "b"]].shape == (1, 2)
    assert df.select_at_idx(0).name == "a"
    assert (df.a == df["a"]).sum() == 3
    assert (df.c == df["a"]).sum() == 0


def test_sort():
    df = DataFrame({"a": [2, 1, 3], "b": [1, 2, 3]})
    df.sort("a", in_place=True)
    assert df.frame_equal(DataFrame({"a": [1, 2, 3], "b": [2, 1, 3]}))


def test_replace():
    df = DataFrame({"a": [2, 1, 3], "b": [1, 2, 3]})
    s = Series("c", [True, False, True])
    df.replace("a", s)
    assert df.frame_equal(DataFrame({"c": [True, False, True], "b": [1, 2, 3]}))


def test_slice():
    df = DataFrame({"a": [2, 1, 3], "b": ["a", "b", "c"]})
    df = df.slice(1, 2)
    assert df.frame_equal(DataFrame({"a": [1, 3], "b": ["b", "c"]}))


def test_head_tail():
    df = DataFrame({"a": range(10), "b": range(10)})
    assert df.head(5).height == 5
    assert df.tail(5).height == 5

    assert not df.head(5).frame_equal(df.tail(5))
    # check if it doesn't fail when out of bounds
    assert df.head(100).height == 10
    assert df.tail(100).height == 10


def test_groupby():
    df = DataFrame(
        {
            "a": ["a", "b", "a", "b", "b", "c"],
            "b": [1, 2, 3, 4, 5, 6],
            "c": [6, 5, 4, 3, 2, 1],
        }
    )
    assert (
        df.groupby("a")
        .select("b")
        .sum()
        .frame_equal(DataFrame({"a": ["a", "b", "c"], "": [4, 11, 6]}))
    )
    assert (
        df.groupby("a")
        .select("c")
        .sum()
        .frame_equal(DataFrame({"a": ["a", "b", "c"], "": [10, 10, 1]}))
    )
    assert (
        df.groupby("a")
        .select("b")
        .min()
        .frame_equal(DataFrame({"a": ["a", "b", "c"], "": [1, 2, 6]}))
    )
    assert (
        df.groupby("a")
        .select("b")
        .max()
        .frame_equal(DataFrame({"a": ["a", "b", "c"], "": [3, 5, 6]}))
    )
    assert (
        df.groupby("a")
        .select("b")
        .mean()
        .frame_equal(DataFrame({"a": ["a", "b", "c"], "": [2.0, (2 + 4 + 5) / 3, 6.0]}))
    )
    assert (
        df.groupby("a")
        .select("b")
        .last()
        .frame_equal(DataFrame({"a": ["a", "b", "c"], "": [3, 5, 6]}))
    )
    # check if it runs
    (df.groupby("a").select("b").n_unique())

    (df.groupby("a").select("b").quantile(0.3))

    #
    # # TODO: is false because count is u32
    # df.groupby(by="a", select="b", agg="count").frame_equal(
    #     DataFrame({"a": ["a", "b", "c"], "": [2, 3, 1]})
    # )


def test_join():
    df_left = DataFrame(
        {"a": ["a", "b", "a", "z"], "b": [1, 2, 3, 4], "c": [6, 5, 4, 3],}
    )
    df_right = DataFrame(
        {"a": ["b", "c", "b", "a"], "k": [0, 3, 9, 6], "c": [1, 0, 2, 1],}
    )

    joined = df_left.join(df_right, left_on="a", right_on="a").sort("a")
    assert joined["b"].series_equal(Series("", [1, 3, 2, 2]))
    joined = df_left.join(df_right, left_on="a", right_on="a", how="left").sort("a")
    assert joined["c_right"].is_null().sum() == 1
    assert joined["b"].series_equal(Series("", [1, 3, 2, 2, 4]))
    joined = df_left.join(df_right, left_on="a", right_on="a", how="outer").sort("a")
    assert joined["c_right"].null_count() == 1
    assert joined["c"].null_count() == 2
    assert joined["b"].null_count() == 2


def test_hstack():
    df = DataFrame({"a": [2, 1, 3], "b": ["a", "b", "c"]})
    df.hstack([Series("stacked", [-1, -1, -1])])
    assert df.shape == (3, 3)
    assert df.columns == ["a", "b", "stacked"]


def test_drop():
    df = DataFrame({"a": [2, 1, 3], "b": ["a", "b", "c"], "c": [1, 2, 3]})
    df = df.drop("a")
    assert df.shape == (3, 2)
    df = DataFrame({"a": [2, 1, 3], "b": ["a", "b", "c"], "c": [1, 2, 3]})
    s = df.drop_in_place("a")
    assert s.name == "a"


def test_file_buffer():
    f = BytesIO()
    f.write(b"1,2,3,4,5,6\n1,2,3,4,5,6")
    f.seek(0)
    df = DataFrame.from_csv(f, has_headers=False)
    assert df.shape == (2, 6)
    f.seek(0)

    # check if not fails on TryClone and Length impl in file.rs
    with pytest.raises(RuntimeError) as e:
        df.from_parquet(f)
    assert "Invalid Parquet file" in str(e.value)


def test_set():
    np.random.seed(1)
    df = DataFrame({"foo": np.random.rand(10), "bar": np.arange(10), "ham": ["h"] * 10})
    df["new"] = np.random.rand(10)
    df[df["new"] > 0.5, "new"] = 1
