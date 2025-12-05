'use client';

import Editor from '@monaco-editor/react';
import { AlertCircle, Copy, FileJson } from 'lucide-react';
import { useRef, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TableRowData {
  name: string;
  valueType: string;
}

export default function JsonToTable() {
  const [rows, setRows] = useState<TableRowData[]>([]);
  const [table, setTable] = useState<React.JSX.Element[]>([]);
  const [maxCol, setMaxCol] = useState(0);
  const [enableConvert, setEnableConvert] = useState(false);
  const [jsonAlert, setJsonAlert] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);

  let maxCount = 0;

  function convertJson(
    jsonObj: object,
    nestCount = 0
  ): { genRows: TableRowData[]; maxCount: number } {
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

  function renderRow(
    row: {
      child?: { genRows: []; maxCount: number };
      name: string;
      valueType: string;
    },
    parentName: string,
    level = 0
  ) {
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
    displayRows: React.JSX.Element[],
    genRows: {
      child?: { genRows: []; maxCount: number };
      name: string;
      valueType: string;
    }[],
    parentName?: string,
    level = 0
  ) {
    for (const row of genRows) {
      if (parentName) {
        displayRows.push(renderRow(row, parentName, level));
      }
      if (row.child) {
        renderTable(displayRows, row.child.genRows, row.name, level + 1);
      }
    }
  }

  function onClick() {
    console.log('clicked');
    const displayRows: React.JSX.Element[] = [];
    renderTable(displayRows, rows);
    setTable(displayRows);
  }

  function copyTableHTML() {
    const copiableTable = tableRef.current?.innerHTML;
    if (!copiableTable) {
      console.log('failed to copy table html!');
      return;
    }
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

  function copyTable() {
    const table = tableRef.current;
    if (!table) {
      alert('Table not found!');
      return;
    }

    // Create a range to select the table's rendered content
    const range = document.createRange();
    range.selectNodeContents(table);

    // Remove any existing selections
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    try {
      // Execute copy command: this copies the rendered fragment to clipboard
      const successful = document.execCommand('copy');
      if (successful) {
        alert(
          'Rendered table copied! You can paste it into Confluence or any WYSIWYG editor.'
        );
      } else {
        alert('Failed to copy rendered table.');
      }
    } catch (err) {
      alert(`Copy command failed: ${err}`);
    }

    // Clear selection to clean up UI
    selection?.removeAllRanges();
  }

  function onChange(value: string | undefined) {
    try {
      setJsonAlert(false);
      if (!value) {
        setEnableConvert(false);
        return;
      }
      const { genRows, maxCount } = convertJson(JSON.parse(value));
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
    <div className="container mx-auto max-w-full h-[calc(100vh-10rem)] px-4 py-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileJson className="h-8 w-8" />
          JSON to Type Table Converter
        </h1>
        <p className="text-muted-foreground mt-1">
          Convert JSON data to a structured table format with type information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100%-5rem)]">
        {/* Left Panel - JSON Input */}
        <Card className="flex flex-col h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>JSON Input</span>
              <Button
                size="sm"
                disabled={!enableConvert}
                onClick={() => onClick()}
              >
                Convert to Table
              </Button>
            </CardTitle>
            <CardDescription>
              Paste your JSON data below. The editor supports syntax
              highlighting and code folding.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            {jsonAlert && (
              <Alert variant="destructive" className="mb-3">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Invalid JSON</AlertTitle>
                <AlertDescription>
                  Please check your JSON formatting and try again.
                </AlertDescription>
              </Alert>
            )}
            <div className="flex-1 border rounded-md overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage="json"
                defaultValue='{\n  "example": "Paste your JSON here"\n}'
                theme="vs-dark"
                onChange={onChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  readOnly: false,
                  automaticLayout: true,
                  folding: true,
                  foldingStrategy: 'indentation',
                  showFoldingControls: 'always',
                  formatOnPaste: true,
                  formatOnType: true,
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Right Panel - Table Output */}
        <Card className="flex flex-col h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Table Output</span>
              {table.length > 0 && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyTableHTML}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy HTML
                  </Button>
                  <Button size="sm" variant="outline" onClick={copyTable}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Table
                  </Button>
                </div>
              )}
            </CardTitle>
            <CardDescription>
              Structured representation of your JSON schema
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {table.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <FileJson className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No data to display</p>
                  <p className="text-sm">
                    Convert JSON to see the table output
                  </p>
                </div>
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
