'use client';

import { type ChangeEvent, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function JsonToTable() {
  const [rows, setRows] = useState([]);
  const [table, setTable] = useState([]);
  const [maxCol, setMaxCol] = useState(0);
  const [enableConvert, setEnableConvert] = useState(false);
  const [jsonAlert, setJsonAlert] = useState(false);
  const tableRef = useRef(null);

  let maxCount = 0;

  function convertJson(jsonObj: object, nestCount = 0) {
    maxCount = maxCount > nestCount ? maxCount : nestCount;
    const genRows = [];
    for (const [key, value] of Object.entries(jsonObj)) {
      if (Array.isArray(value)) {
        const firstItem = value[0];
        if (typeof firstItem === 'object') {
          const valueTypeOfFirstItem = convertJson(firstItem, nestCount + 1);
          genRows.push({
            name: key,
            valueType: 'Object[]',
            child: valueTypeOfFirstItem,
          });
          continue;
        }
        const firstItemType = typeof firstItem;
        genRows.push({
          name: key,
          valueType: `${firstItemType}[]`,
          value: firstItem,
        });
        continue;
      }

      if (typeof value === 'object') {
        if (value === null) {
          genRows.push({
            name: key,
            valueType: 'null',
          });
          continue;
        }
        if (value === undefined) {
          genRows.push({
            name: key,
            valueType: 'undefined',
          });
          continue;
        }
        genRows.push({
          name: key,
          valueType: 'Object',
          child: convertJson(value, nestCount + 1),
        });
        continue;
      }

      const valueType = typeof value;
      genRows.push({
        name: key,
        valueType,
        value,
      });
    }

    return { genRows, maxCount };
  }

  function renderRow(row, parentName, level = 0) {
    if (level === 0) {
      return (
        <TableRow className="border" key={`row-${row.name}`}>
          <TableCell
            className="border"
            key={`row-${row.name}-name`}
            colSpan={maxCol === 0 ? undefined : maxCol + 1}
          >
            {row.name}
          </TableCell>
          <TableCell className="border" key={`row-${row.name}-valueType`}>
            {row.valueType}
          </TableCell>
          <TableCell className="border" key={`row-${row.name}-description`} />
        </TableRow>
      );
    }
    const prependTableCell = [];
    for (let i = 0; i < level; i++) {
      prependTableCell.push(
        <TableCell key={`row-${parentName}-${row.name}-${i}`} />
      );
    }
    return (
      <TableRow key={`row-${parentName}-${row.name}-${level}`}>
        {prependTableCell}
        <TableCell
          className="border"
          key={`row-${parentName}-${row.name}-name-${level}`}
          colSpan={maxCol + 1 - level}
        >
          {row.name}
        </TableCell>
        <TableCell
          className="border"
          key={`row-${parentName}-${row.name}-valueType-${level}`}
        >
          {row.valueType}
        </TableCell>
        <TableCell
          className="border"
          key={`row-${parentName}-${row.name}-description-${level}`}
        />
      </TableRow>
    );
  }

  function renderTable(
    displayRows,
    genRows: { child?: { genRows: []; maxCount: number }; name: string }[],
    parentName?: string,
    level = 0
  ) {
    for (const row of genRows) {
      displayRows.push(renderRow(row, parentName, level));
      if (row.child) {
        renderTable(displayRows, row.child.genRows, row.name, level + 1);
      }
    }
  }

  function onClick() {
    console.log('clicked');
    const displayRows = [];
    renderTable(displayRows, rows);
    setTable(displayRows);
  }

  function copyTableHTML() {
    const copiableTable = tableRef.current.innerHTML;
    navigator.clipboard.writeText(copiableTable);
  }

  // function generateChildRows(newRow, row) {
  //   if (row.child && row.child.length > 0) {
  //     const newRowChild = row.child.map((child) => {
  //       if (child.child) {
  //         return generateChildRows(newRow, child);
  //       }
  //       return [child.name, child.valueType].join(' ');
  //     });
  //     console.log(newRowChild);
  //     newRow = [newRow, newRowChild.join('\n')].join('\n');
  //   }
  //   return newRow;
  // }

  function copyTable() {}

  function onChange(event: ChangeEvent<HTMLTextAreaElement>) {
    try {
      setJsonAlert(false);
      const text = event.target.value;
      const { genRows, maxCount } = convertJson(JSON.parse(text));
      setRows(genRows);
      setMaxCol(maxCount);
      setEnableConvert(true);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        console.error(error.stack);
      }
      setJsonAlert(true);
      setEnableConvert(false);
    }
  }

  return (
    <div className="container space-y-2 mx-auto w-screen h-screen mb-10">
      <Card className="b">
        <CardHeader>
          <CardTitle>JSON</CardTitle>
          <CardDescription>Input your JSON file here</CardDescription>
        </CardHeader>
        <CardContent>
          {jsonAlert && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Unable to parse JSON!</AlertTitle>
              <AlertDescription>
                Please check your JSON formatting.
              </AlertDescription>
            </Alert>
          )}
          <Textarea
            id="jsonText"
            onChange={onChange}
            className="w-full min-h-80 mt-2"
          />
          <Button
            className="button w-full mt-2"
            disabled={!enableConvert}
            onClick={() => onClick()}
          >
            Convert
          </Button>
        </CardContent>
      </Card>
      {table.length > 0 && (
        <Card className="b h-max">
          <CardHeader>
            <CardTitle className="flex justify-between">
              <div className="">Output Table</div>
              <div className="space-x-1">
                <Button
                  variant="ghost"
                  className="text-sm h-8 px-4"
                  disabled={table.length === 0}
                  onClick={copyTableHTML}
                >
                  Copy HTML Table
                </Button>

                <Button
                  variant="ghost"
                  className="text-sm h-8 px-4"
                  disabled={true} //{table.length === 0}
                  onClick={copyTable}
                >
                  Copy Raw Table (Not available)
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent id="tableRender">
            <Table ref={tableRef} className="border border-collapse">
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="border"
                    colSpan={maxCol === 0 ? undefined : maxCol + 1}
                  >
                    Key
                  </TableHead>
                  <TableHead className="border">Type</TableHead>
                  <TableHead className="border">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{table}</TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
