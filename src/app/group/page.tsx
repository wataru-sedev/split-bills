import Link from "next/link"

export default function GroupPage () {
  return(
    <div className="flex justify-center pt-10" >
      <div className="w-96 bg-white shadow-md rounded-xl p-6 flex flex-col gap-6 items-center">
        <h1 className="mb-1" >グループページ</h1>
        <h1 className="mb-1" >北海道旅行</h1>
        <p>ドラえもん・のびた・すねお・ジャイアン</p>
        <Link href='/group/new' className="w-full bg-cyan-500 text-white rounded px-4 py-2 hover:shadow-lg" >立替記録を追加</Link>
      </div>
    </div>
  )
}
