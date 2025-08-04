type Entry = {
  begin: Date;
  end: Date;
  duration: number;
  accumulated: number;
  reference?: string;
  description: string;
};

// testdates.text
const getWorksheet = (path: string) =>
  Deno.readTextFile(path).then((message) => {
    const fileData: Entry[] = [];
    const data = message.split(/[\r\n]+/);
    let lastDate: Date;
    let lastDesc: string;
    let onbreak: boolean = true;
    let accuworkTime: number = 0;
    data.forEach((entry: string) => {
      const matches = entry.match(/(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d) (.*)/);
      if (matches) {
        const [, datetime, description] = matches;
        const curDate = new Date(datetime);
        const curDescription = description.trimEnd();
        if (curDescription == "break" || curDescription == "end") {
          accuworkTime += calcpasstime(lastDate, curDate);
          fileData.push(
            {
              begin: lastDate,
              end: curDate,
              duration: Number(calcpasstime(lastDate, curDate).toFixed(2)),
              accumulated: Number(accuworkTime.toFixed(2)),
              description: lastDesc
            }
          );
          onbreak = true;
        } else {
          if (!onbreak) {
            accuworkTime += calcpasstime(lastDate, curDate);
            fileData.push(
              {
              begin: lastDate,
              end: curDate,
              duration: Number(calcpasstime(lastDate, curDate).toFixed(2)),
              accumulated: Number(accuworkTime.toFixed(2)),
              description: lastDesc
            }
            );
          } else {
            onbreak = false;
          }
        }
        lastDesc = curDescription;
        lastDate = curDate;
      }
    });
    return fileData;
  });

let dir = Deno.cwd().replaceAll("\\", "/") + "/";

if (!dir.endsWith("/")) {
  dir += "/";
}

for await (const directory of Deno.readDir(dir)) {
  if (!directory.isFile) {
    continue;
  }
  if (!(directory.name.split(".")[1] == "text")) {
    continue;
  }
  const fullpath = dir + directory.name;
  const csvFullpath = dir + "csv/" + directory.name.replace(".text", ".csv");
  getWorksheet(fullpath).then((message) => {
    Deno.writeTextFile(csvFullpath, convertEntriesToCSV(message));
  });
}

function calcpasstime(lastDate: Date, curDate: Date): number {
  return (
    roundUP((curDate.getTime() - lastDate.getTime()) / 1000 / 60 / 5, 0) / 12
  );
}

function roundUP(number: number, precision: number): number {
  const power = Math.pow(10, precision);
  return Math.ceil(number * power) / power;
}

function convertEntriesToCSV(entries: Entry[]): string {
  const headers = [
    "begin",
    "end",
    "duration",
    "accumulated",
    "reference",
    "description",
  ];
  const rows = entries.map((entry) => [
    entry.begin.toISOString(),
    entry.end.toISOString(),
    entry.duration.toString(),
    entry.accumulated.toString(),
    entry.reference || "",
    entry.description.toString().replace(/"/g, '""'),
  ]);
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csvContent;
}
