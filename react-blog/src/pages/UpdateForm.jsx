import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "../api/http";
import FormCard from "../components/FormCard";
import Input from "../components/Input";
import Loading from "../components/Loading";

export default function UpdateForm() {
  const { id } = useParams();
  const [form, setForm] = useState({ title: "", content: "" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 상세 화면과 같은 키로 글을 꺼낸다
  // 상세에서 수정을 눌러 들어오면 상세가 받아 둔 캐시로 바로 채운다
  // 같은 키에는 같은 모양이 들어가야 하니 상세처럼 res.data.body 전체를 돌려준다
  const { data: board, isPending } = useQuery({
    queryKey: ["boards", "detail", id],
    queryFn: async () => {
      const res = await http.get(`/api/boards/${id}`);
      return res.data.body;
    },
  });

  // board가 캐시에서 오면 그 값으로 폼을 채운다
  useEffect(() => {
    if (board) {
      setForm({ title: board.title, content: board.content });
    }
  }, [board]);

  const updateBoard = useMutation({
    mutationFn: () => http.put(`/api/boards/${id}`, form),
    onSuccess: async () => {
      // 목록 키를 무효화한다
      // 목록을 쓰는 화면이 없어 inactive라 "all"로 지금 받게 한다
      // 기다리지 않는다. 지금 갈 곳은 상세이고, 목록은 그사이 뒤에서 받아 둔다
      queryClient.invalidateQueries({
        queryKey: ["boards", "list"],
        refetchType: "all",
      });
      // 상세 키를 무효화한다
      // 이 수정 화면도 위 useQuery에서 같은 상세 키를 쓰고 있다
      // 화면에 떠 있는 useQuery가 쓰는 키는 active라서, 기본값만으로 지금 바로 다시 받는다
      // 다 받은 뒤 이동한다. 그래야 상세 화면에 옛 제목이 잠깐도 보이지 않는다
      await queryClient.invalidateQueries({
        queryKey: ["boards", "detail", id],
      });
      navigate(`/board/${id}`);
    },
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    updateBoard.mutate();
  }

  if (isPending) {
    return <Loading />;
  }

  return (
    <FormCard title="글 수정" onSubmit={handleSubmit}>
      <Input
        name="title"
        placeholder="제목"
        value={form.title}
        onChange={handleChange}
      />
      <textarea
        className="textarea"
        name="content"
        placeholder="내용"
        value={form.content}
        onChange={handleChange}
      />
      <button className="btn">수정하기</button>
    </FormCard>
  );
}
