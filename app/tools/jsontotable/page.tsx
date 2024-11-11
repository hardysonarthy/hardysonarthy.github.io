'use client';

import { ChangeEvent, ChangeEventHandler, useState } from 'react';
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
  const [jsonText, setJsonText] = useState({});
  const [table, setTable] = useState('');

  function convertJson(jsonObj: Object) {
    let rows = [];
    for (const [key, value] of Object.entries(jsonObj)) {
      if (typeof value === 'object') {
        rows.push(convertJson(value));
        continue;
      }
      const valueType = typeof value;
      rows.push({
        name: key,
        valueType,
        value,
      });
    }
    return rows;
  }

  function renderTable(rows: any[]) {
    const tableRender = [];
    tableRender.push('<table>');
    tableRender.push('<thead><thead>');
    tableRender.push('<tbody>');

    for (const obj of rows) {
    }

    tableRender.push('</tbody></table>');

    setTable(tableRender.join(''));
    return table;
  }

  function onClick() {
    console.log('clicked');
    const rows = convertJson(jsonText);
    renderTable(rows);
  }

  function onChange(event: ChangeEvent<HTMLTextAreaElement>) {
    try {
      const text = event.target.value;
      const json = JSON.parse(text);
      setJsonText(json);
    } catch (error) {
      console.log('error');
    }
  }

  return (
    <div className="container space-y-2 mx-auto w-screen h-screen">
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
            <div className="">Output Table</div>
            <Button className="" disabled={table === ''} onClick={() => {}}>
              Copy Table
            </Button>
          </CardTitle>
          <CardDescription>Table output</CardDescription>
        </CardHeader>
        <CardContent id="tableRender">
          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th>Key</th>
                <th>Type</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
}
