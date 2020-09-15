(function() {var implementors = {};
implementors["polars"] = [{"text":"impl Unpin for Series","synthetic":true,"types":[]},{"text":"impl&lt;T&gt; Unpin for ChunkedArray&lt;T&gt; <span class=\"where fmt-newline\">where<br>&nbsp;&nbsp;&nbsp;&nbsp;T: Unpin,&nbsp;</span>","synthetic":true,"types":[]},{"text":"impl Unpin for FillNoneStrategy","synthetic":true,"types":[]},{"text":"impl&lt;T&gt; Unpin for PrimitiveChunkedBuilder&lt;T&gt; <span class=\"where fmt-newline\">where<br>&nbsp;&nbsp;&nbsp;&nbsp;T: Unpin,&nbsp;</span>","synthetic":true,"types":[]},{"text":"impl Unpin for Utf8ChunkedBuilder","synthetic":true,"types":[]},{"text":"impl&lt;T&gt; Unpin for AlignedVec&lt;T&gt; <span class=\"where fmt-newline\">where<br>&nbsp;&nbsp;&nbsp;&nbsp;T: Unpin,&nbsp;</span>","synthetic":true,"types":[]},{"text":"impl&lt;T&gt; Unpin for LargeListPrimitiveChunkedBuilder&lt;T&gt; <span class=\"where fmt-newline\">where<br>&nbsp;&nbsp;&nbsp;&nbsp;T: Unpin,&nbsp;</span>","synthetic":true,"types":[]},{"text":"impl Unpin for LargeListUtf8ChunkedBuilder","synthetic":true,"types":[]},{"text":"impl&lt;'a, T&gt; Unpin for NumIterSingleChunkNullCheck&lt;'a, T&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a, T&gt; Unpin for NumIterSingleChunk&lt;'a, T&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a, T&gt; Unpin for NumIterManyChunk&lt;'a, T&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a, T&gt; Unpin for NumIterManyChunkNullCheck&lt;'a, T&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for Utf8IterCont&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for Utf8IterSingleChunk&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for Utf8IterSingleChunkNullCheck&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for Utf8IterManyChunk&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for Utf8IterManyChunkNullCheck&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for BooleanIterCont&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for BooleanIterSingleChunk&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for BooleanIterSingleChunkNullCheck&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for BooleanIterManyChunk&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for BooleanIterManyChunkNullCheck&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for ListIterCont&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for ListIterSingleChunk&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for ListIterSingleChunkNullCheck&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for ListIterManyChunk&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for ListIterManyChunkNullCheck&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a, T&gt; Unpin for NumericChunkIterDispatch&lt;'a, T&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for Utf8ChunkIterDispatch&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for BooleanIterDispatch&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for ListIterDispatch&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a, T&gt; Unpin for NumTakeRandomChunked&lt;'a, T&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a, T&gt; Unpin for NumTakeRandomCont&lt;'a, T&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a, T&gt; Unpin for NumTakeRandomSingleChunk&lt;'a, T&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for Utf8TakeRandom&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for Utf8TakeRandomSingleChunk&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for BoolTakeRandom&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for BoolTakeRandomSingleChunk&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for ListTakeRandom&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for ListTakeRandomSingleChunk&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'a, T&gt; Unpin for NumTakeRandomDispatch&lt;'a, T&gt;","synthetic":true,"types":[]},{"text":"impl Unpin for Utf8Type","synthetic":true,"types":[]},{"text":"impl Unpin for LargeListType","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for AnyType&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl Unpin for PolarsError","synthetic":true,"types":[]},{"text":"impl Unpin for DataFrame","synthetic":true,"types":[]},{"text":"impl&lt;'a&gt; Unpin for RecordBatchIter&lt;'a&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'df, 'selection_str&gt; Unpin for GroupBy&lt;'df, 'selection_str&gt;","synthetic":true,"types":[]},{"text":"impl&lt;'df, 'selection_str&gt; Unpin for Pivot&lt;'df, 'selection_str&gt; <span class=\"where fmt-newline\">where<br>&nbsp;&nbsp;&nbsp;&nbsp;'selection_str: 'df,&nbsp;</span>","synthetic":true,"types":[]},{"text":"impl&lt;'a, W&gt; Unpin for CsvWriter&lt;'a, W&gt;","synthetic":true,"types":[]},{"text":"impl&lt;R&gt; Unpin for CsvReader&lt;R&gt; <span class=\"where fmt-newline\">where<br>&nbsp;&nbsp;&nbsp;&nbsp;R: Unpin,&nbsp;</span>","synthetic":true,"types":[]},{"text":"impl&lt;R&gt; Unpin for IPCReader&lt;R&gt; <span class=\"where fmt-newline\">where<br>&nbsp;&nbsp;&nbsp;&nbsp;R: Unpin,&nbsp;</span>","synthetic":true,"types":[]},{"text":"impl&lt;'a, W&gt; Unpin for IPCWriter&lt;'a, W&gt;","synthetic":true,"types":[]},{"text":"impl&lt;R&gt; Unpin for JsonReader&lt;R&gt; <span class=\"where fmt-newline\">where<br>&nbsp;&nbsp;&nbsp;&nbsp;R: Unpin,&nbsp;</span>","synthetic":true,"types":[]},{"text":"impl&lt;R&gt; Unpin for ParquetReader&lt;R&gt; <span class=\"where fmt-newline\">where<br>&nbsp;&nbsp;&nbsp;&nbsp;R: Unpin,&nbsp;</span>","synthetic":true,"types":[]}];
if (window.register_implementors) {window.register_implementors(implementors);} else {window.pending_implementors = implementors;}})()