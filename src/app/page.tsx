import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center pt-10">
      <div className="w-96 bg-white shadow-md rounded-xl p-6 flex flex-col gap-6 items-center">
        <div className="w-full">
          <p className="text-sm text-gray-600 mb-1" >グループ名</p>
          <input type="text" placeholder="北海道旅行" className="w-full border rounded px-3 py-2 hover:shadow focus:outline-none focus:ring-2 focus:ring-cyan-300"/>
        </div>
        <div className="w-full">
          <p className="text-sm text-gray-600 mb-1" >メンバー名</p>
          <div className="flex gap-2" >
            <input type="text" placeholder="たろう" className="flex-1 border rounded px-3 py-2 hover:shadow focus:outline-none focus:ring-2 focus:ring-cyan-300" />
            <button className="bg-cyan-500 text-white rounded-xl px-4 py-2 hover:cursor-pointer hover:shadow-lg">追加</button>
          </div>   
        </div>
        <Link href='/group' className="w-full bg-cyan-500 text-white rounded px-4 py-2 hover:cursor-pointer hover:shadow-lg" >グループページを作成</Link>
      </div>
    </div>
  );
}
