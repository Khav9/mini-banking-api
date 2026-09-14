import { useEffect, useState } from "react";
import { boardApi } from "../api/boardApi";
import { BoardTable } from "../components/BoardTable";
import { CreateBoardDialog } from "../components/CreateBoardDialog";
import { Board } from "../types/board";

const BoardPage = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBoards = async () => {
    setLoading(true);
    try {
      const data = await boardApi.getBoards();
      setBoards(data.data.boards);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Boards</h1>
        <CreateBoardDialog onSuccess={fetchBoards} />
      </div>
      <BoardTable data={boards} loading={loading} onRefresh={fetchBoards} />
    </div>
  );
};

export default BoardPage;
