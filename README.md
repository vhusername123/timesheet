# Log Processing Script

This repository contains a Deno-based script for processing log files, converting them into structured CSV files. The script reads `.text` files containing timestamped log entries, calculates time durations, and organizes the data into CSV format for further analysis.

## Features

- Parses `.text` log files with timestamped entries.
- Calculates duration between entries and accumulated time.
- Supports categorization of log entries as `break`, `end`, or active work periods.
- Outputs structured CSV files with detailed entry information.

## Prerequisites

- **Deno**: Ensure you have Deno installed on your system. [Get Deno here](https://deno.land/#installation).
- `.text` log files: The log files must follow the format:
  ```
  YYYY-MM-DDTHH:MM:SS Description
  ```
  Example:
  ```
  2025-01-01T09:00:00 Start work
  2025-01-01T12:00:00 break
  2025-01-01T13:00:00 Resume work
  2025-01-01T17:00:00 end
  ```

## Setup

1. Clone the repository or download the script.
2. Place your `.text` log files in the same directory as the script or adjust the `dir` variable in the script to point to your log file directory.
3. Run the script using Deno:
   ```bash
   deno run --allow-read --allow-write script.ts
   ```
   Make sure to include `--allow-read` and `--allow-write` permissions for file operations.

## Usage

1. **Log File Directory**: Place your log files in the specified directory (`dir`).
2. **Run the Script**: Execute the script to process all `.text` files.
3. **Output**: The script generates CSV files in a `csv/` subdirectory. Each `.csv` file corresponds to an input `.text` file.

## Script Overview

### Core Data Structure

The script uses the following `Entry` structure to represent log data:
```typescript
type Entry = {
    begin: Date,
    end: Date,
    duration: number,
    accumulated: number,
    reference?: string,
    description: string
};
```

### Key Functions

#### `makeEntry`
Creates an `Entry` object.
```typescript
function makeEntry(begin: Date, end: Date, duration: number, accumulated: number, description: string, reference?: string): Entry
```

#### `getWorksheet`
Parses a log file and processes its entries into an array of `Entry` objects.
```typescript
const getWorksheet = (path: string) => { ... };
```

#### `calcpasstime`
Calculates the time passed between two dates, rounded to the nearest 5-minute interval.
```typescript
function calcpasstime(lastDate: Date, curDate: Date): number
```

#### `convertEntriesToCSV`
Converts an array of `Entry` objects into a CSV string.
```typescript
function convertEntriesToCSV(entries: Entry[]): string
```

### Directory and File Handling
The script:
1. Reads `.text` files from the specified directory.
2. Processes each file into structured `Entry` data.
3. Writes the output to a `csv/` subdirectory.

### Example Output
Given the input log file `example.text`:
```
2025-01-01T09:00:00 Start work
2025-01-01T12:00:00 break
2025-01-01T13:00:00 Resume work
2025-01-01T17:00:00 end
```
The output `example.csv` will contain:
```
begin,end,duration,accumulated,reference,description
"2025-01-01T09:00:00.000Z","2025-01-01T12:00:00.000Z","3.00","3.00","","Start work"
"2025-01-01T13:00:00.000Z","2025-01-01T17:00:00.000Z","4.00","7.00","","Resume work"
```

## License
This script is open-source and available under the [MIT License](LICENSE).

---

Contributions and suggestions are welcome! Feel free to submit an issue or pull request.

