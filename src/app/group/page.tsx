import Link from "next/link"

export default function GroupPage () {
  return(
    <div className="flex flex-col gap-4">
      <h1>グループページ</h1>
      <h1>北海道旅行</h1>
      <p>ドラえもん・のびた・すねお・ジャイアン</p>
      <Link href='/group/new' className="bg-cyan-500 text-white rounded-xl p-4 w-40 hover:shadow-lg" >立替記録を追加</Link>
    </div>
  )
}
