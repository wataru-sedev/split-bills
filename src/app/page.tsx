import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-col items-center justify-center gap-4 pt-6">
        <div className="flex flex-col items-center">
          <p>グループ名</p>
          <input type="text" placeholder="北海道旅行" className="border rounded  p-1 hover:shadow-lg"/>
        </div>
        <div className="">
          <p>メンバー名</p>
          <div>
            <input type="text" placeholder="たろう" className="border rounded  p-1 hover:shadow-lg" />
            <button className="bg-cyan-500 text-white rounded-xl px-4 py-2 hover:cursor-pointer hover:shadow-lg">追加</button>
          </div>   
        </div>
        <Link href='/group' className="bg-cyan-500 text-white rounded-xl px-4 py-2 hover:cursor-pointer hover:shadow-lg" >グループページを作成</Link>
      </div>
    </div>
  );
}
