## Why are write streams so fast?  default size of internal buffer is 16kb
1. Streams are fast because they open the file once and write data in chunks (16kb of chunks once), rather than opening and closing the file multiple times.
2.Rather than taking one data and writing it to the file, streams stores in internal buffer until the buffer is full and then writes the data to the file.

- readFileSync can be considered when the file size is small, and the data can be read in one go.
- readFileSync is synchronous and blocks the execution of the program until the file is read completely.
- readFileSync reads the file in one go and stores the data in memory, which can lead to memory issues if the file size is large.
- readFileSync is not suitable for reading large files as it can slow down the application.

- readStream is used to read large files as it reads the file in chunks and does not store the entire file
- readStream is asynchronous and does not block the execution of the program.
- readStream reads the file in chunks and is memory efficient.
- readStream is suitable for reading large files as it does not slow down the application.
