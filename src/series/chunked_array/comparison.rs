use crate::datatypes::ArrowDataType;
use crate::series::chunked_array::iterator::ChunkIterator;
use crate::{
    datatypes,
    datatypes::BooleanChunked,
    error::{PolarsError, Result},
    series::chunked_array::{ChunkOps, ChunkedArray},
};
use arrow::array::{
    Array, ArrayData, ArrayRef, BooleanArray, BooleanBuilder, PrimitiveArray, StringArray,
};
use arrow::compute;
use arrow::datatypes::ArrowNumericType;
use num::{Num, NumCast, ToPrimitive};
use std::sync::Arc;

pub trait CmpOps<Rhs> {
    fn eq(&self, rhs: Rhs) -> Result<BooleanChunked>;

    fn neq(&self, rhs: Rhs) -> Result<BooleanChunked>;

    fn gt(&self, rhs: Rhs) -> Result<BooleanChunked>;

    fn gt_eq(&self, rhs: Rhs) -> Result<BooleanChunked>;

    fn lt(&self, rhs: Rhs) -> Result<BooleanChunked>;

    fn lt_eq(&self, rhs: Rhs) -> Result<BooleanChunked>;
}

impl<T> ChunkedArray<T>
where
    T: ArrowNumericType,
{
    /// First ensure that the chunks of lhs and rhs match and then iterates over the chunks and applies
    /// the comparison operator.
    fn comparison(
        &self,
        rhs: &ChunkedArray<T>,
        operator: impl Fn(&PrimitiveArray<T>, &PrimitiveArray<T>) -> arrow::error::Result<BooleanArray>,
    ) -> Result<BooleanChunked> {
        let opt = self.optional_rechunk(rhs)?;
        let left = match &opt {
            Some(a) => a,
            None => self,
        };

        let chunks = left
            .downcast_chunks()
            .iter()
            .zip(rhs.downcast_chunks())
            .map(|(left, right)| {
                let arr_res = operator(left, right);
                let arr = match arr_res {
                    Ok(arr) => arr,
                    Err(e) => return Err(PolarsError::ArrowError(e)),
                };
                Ok(Arc::new(arr) as ArrayRef)
            })
            .collect::<Result<Vec<_>>>()?;

        Ok(ChunkedArray::new_from_chunks("", chunks))
    }
}

impl<T> CmpOps<&ChunkedArray<T>> for ChunkedArray<T>
where
    T: ArrowNumericType,
{
    fn eq(&self, rhs: &ChunkedArray<T>) -> Result<BooleanChunked> {
        self.comparison(rhs, compute::eq)
    }

    fn neq(&self, rhs: &ChunkedArray<T>) -> Result<BooleanChunked> {
        self.comparison(rhs, compute::neq)
    }

    fn gt(&self, rhs: &ChunkedArray<T>) -> Result<BooleanChunked> {
        self.comparison(rhs, compute::gt)
    }

    fn gt_eq(&self, rhs: &ChunkedArray<T>) -> Result<BooleanChunked> {
        self.comparison(rhs, compute::gt_eq)
    }

    fn lt(&self, rhs: &ChunkedArray<T>) -> Result<BooleanChunked> {
        self.comparison(rhs, compute::lt)
    }

    fn lt_eq(&self, rhs: &ChunkedArray<T>) -> Result<BooleanChunked> {
        self.comparison(rhs, compute::lt_eq)
    }
}

/// Auxiliary trait for CmpOps trait
pub trait BoundedToUtf8 {}
impl BoundedToUtf8 for datatypes::Utf8Type {}

impl ChunkedArray<datatypes::Utf8Type> {
    fn comparison<T: BoundedToUtf8>(
        &self,
        rhs: &ChunkedArray<T>,
        operator: impl Fn(&StringArray, &StringArray) -> arrow::error::Result<BooleanArray>,
    ) -> Result<BooleanChunked> {
        let opt = self.optional_rechunk(rhs)?;
        let left = match &opt {
            Some(a) => a,
            None => self,
        };

        let chunks = left
            .chunks
            .iter()
            .zip(&rhs.chunks)
            .map(|(left, right)| {
                let left = left
                    .as_any()
                    .downcast_ref::<StringArray>()
                    .expect("could not downcast one of the chunks");
                let right = right
                    .as_any()
                    .downcast_ref::<StringArray>()
                    .expect("could not downcast one of the chunks");
                let arr_res = operator(left, right);
                let arr = match arr_res {
                    Ok(arr) => arr,
                    Err(e) => return Err(PolarsError::ArrowError(e)),
                };
                Ok(Arc::new(arr) as ArrayRef)
            })
            .collect::<Result<Vec<_>>>()?;

        Ok(ChunkedArray::new_from_chunks("", chunks))
    }
}

impl<T> CmpOps<&ChunkedArray<T>> for ChunkedArray<datatypes::Utf8Type>
where
    T: BoundedToUtf8,
{
    fn eq(&self, rhs: &ChunkedArray<T>) -> Result<BooleanChunked> {
        self.comparison(rhs, compute::eq_utf8)
    }

    fn neq(&self, rhs: &ChunkedArray<T>) -> Result<BooleanChunked> {
        self.comparison(rhs, compute::neq_utf8)
    }

    fn gt(&self, rhs: &ChunkedArray<T>) -> Result<BooleanChunked> {
        self.comparison(rhs, compute::gt_utf8)
    }

    fn gt_eq(&self, rhs: &ChunkedArray<T>) -> Result<BooleanChunked> {
        self.comparison(rhs, compute::gt_eq_utf8)
    }

    fn lt(&self, rhs: &ChunkedArray<T>) -> Result<BooleanChunked> {
        self.comparison(rhs, compute::lt_utf8)
    }

    fn lt_eq(&self, rhs: &ChunkedArray<T>) -> Result<BooleanChunked> {
        self.comparison(rhs, compute::lt_eq_utf8)
    }
}

fn cmp_chunked_array_to_num<T, Rhs>(
    ca: &ChunkedArray<T>,
    lambda: &dyn Fn(Rhs) -> bool,
) -> Result<BooleanChunked>
where
    T: ArrowNumericType,
    T::Native: ToPrimitive,
    Rhs: Num + NumCast,
{
    let chunks = ca
        .downcast_chunks()
        .iter()
        .map(|&a| {
            let mut builder = BooleanBuilder::new(a.len());

            for i in 0..a.len() {
                let val = a.value(i);
                let val = Rhs::from(val);
                let val = match val {
                    Some(val) => val,
                    None => return Err(PolarsError::DataTypeMisMatch),
                };
                builder.append_value(lambda(val));
            }
            Ok(Arc::new(builder.finish()) as ArrayRef)
        })
        .collect::<Result<Vec<_>>>()?;

    Ok(BooleanChunked::new_from_chunks("", chunks))
}

impl<T, Rhs> CmpOps<Rhs> for ChunkedArray<T>
where
    T: ArrowNumericType,
    T::Native: ToPrimitive,
    Rhs: Num + NumCast + PartialOrd,
{
    fn eq(&self, rhs: Rhs) -> Result<BooleanChunked> {
        cmp_chunked_array_to_num(self, &|lhs: Rhs| lhs == rhs)
    }

    fn neq(&self, rhs: Rhs) -> Result<BooleanChunked> {
        cmp_chunked_array_to_num(self, &|lhs: Rhs| lhs != rhs)
    }

    fn gt(&self, rhs: Rhs) -> Result<BooleanChunked> {
        cmp_chunked_array_to_num(self, &|lhs: Rhs| lhs > rhs)
    }

    fn gt_eq(&self, rhs: Rhs) -> Result<BooleanChunked> {
        cmp_chunked_array_to_num(self, &|lhs: Rhs| lhs >= rhs)
    }

    fn lt(&self, rhs: Rhs) -> Result<BooleanChunked> {
        cmp_chunked_array_to_num(self, &|lhs: Rhs| lhs < rhs)
    }

    fn lt_eq(&self, rhs: Rhs) -> Result<BooleanChunked> {
        cmp_chunked_array_to_num(self, &|lhs: Rhs| lhs <= rhs)
    }
}

mod test {
    use super::*;

    #[test]
    fn utf8_cmp() {
        let a = ChunkedArray::<datatypes::Utf8Type>::new_utf8_from_slice("a", &["hello", "world"]);
        let b = ChunkedArray::<datatypes::Utf8Type>::new_utf8_from_slice("a", &["hello", "world"]);
        let sum_true = a.eq(&b).unwrap().iter().fold(0, |acc, opt| match opt {
            Some(b) => acc + b as i32,
            None => acc,
        });

        assert_eq!(2, sum_true)
    }
}