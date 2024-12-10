"use client";

import { useState } from "react";
import RestockDialog from "./RestockDialog";

type TableRowProps = {
  branchId: string;
  id: string;
  quantity: number;
  name: string;
  tag: boolean;
};
export default function TableRow({
  branchId,
  id,
  quantity,
  name,
  tag,
}: TableRowProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(true);

  return (
    <tr key={id}>
      <td>{name}</td>
      <td>{quantity}</td>
      <td>
        <button
          onClick={() => {
            setIsAdd(false);
            setDialogOpen(true);
          }}
          className="px-3 py-1 bg-red-500 text-white rounded m-4"
        >
          -
        </button>
        <button
          onClick={() => {
            setIsAdd(true);
            setDialogOpen(true);
          }}
          className="px-3 py-1 bg-green-500 text-white rounded m-4"
        >
          +
        </button>
      </td>
      <RestockDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        branchId={branchId}
        targetId={id}
        isAdd={isAdd}
        targetName={name}
        tag={tag}
      />
    </tr>
  );
}
