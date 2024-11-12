'use client';

import { ChangeEvent, ChangeEventHandler, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function JsonToTable() {
  const [rows, setRows] = useState([]);
  const [table, setTable] = useState([]);
  const [maxCol, setMaxCol] = useState(0);
  const tableRef = useRef(null);

  let maxCount = 0;

  function convertJson(jsonObj: Object, nestCount = 0) {
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
        genRows.push({
          name: key,
          valueType: 'Object[]',
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
        <TableRow key={`row-${row.name}`}>
          <TableCell
            key={`row-${row.name}-name`}
            colSpan={maxCol === 0 ? undefined : maxCol + 1}
          >
            {row.name}
          </TableCell>
          <TableCell key={`row-${row.name}-valueType`}>
            {row.valueType}
          </TableCell>
          <TableCell key={`row-${row.name}-description`}></TableCell>
        </TableRow>
      );
    }
    const prependTableCell = [];
    for (let i = 0; i < level; i++) {
      prependTableCell.push(
        <TableCell key={`row-${parentName}-${row.name}-${i}`}></TableCell>
      );
    }
    return (
      <TableRow key={`row-${parentName}-${row.name}-${level}`}>
        {prependTableCell}
        <TableCell
          key={`row-${parentName}-${row.name}-name-${level}`}
          colSpan={maxCol + 1 - level}
        >
          {row.name}
        </TableCell>
        <TableCell key={`row-${parentName}-${row.name}-valueType-${level}`}>
          {row.valueType}
        </TableCell>
        <TableCell
          key={`row-${parentName}-${row.name}-description-${level}`}
        ></TableCell>
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
    // const textToCopy = copiableTable.map((row) => row).join('');
    // console.log(textToCopy);
    navigator.clipboard.writeText(copiableTable);
  }

  function copyTable() {}

  function onChange(event: ChangeEvent<HTMLTextAreaElement>) {
    try {
      const text = event.target.value;
      const { genRows, maxCount } = convertJson(JSON.parse(text));
      setRows(genRows);
      setMaxCol(maxCount);
    } catch (error) {
      console.log('error');
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
          <Textarea
            id="jsonText"
            onChange={onChange}
            className="w-full min-h-80"
          ></Textarea>
          <Button className="button w-full mt-2" onClick={() => onClick()}>
            Convert
          </Button>
        </CardContent>
      </Card>
      <Card className="b h-max">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <div className="">Output Table {maxCol}</div>
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
                disabled={table.length === 0}
                onClick={copyTable}
              >
                Copy Raw Table
              </Button>
            </div>
          </CardTitle>
          <CardDescription>Table output</CardDescription>
        </CardHeader>
        <CardContent id="tableRender">
          <Table ref={tableRef}>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={maxCol === 0 ? undefined : maxCol + 1}>
                  Key
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{table}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
