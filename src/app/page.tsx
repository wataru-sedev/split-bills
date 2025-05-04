import Link from "next/link";

export default function Home() {
  return (
    <div>
      <p>割り勘</p>
      <Link href='/group' className="hover:underline" >グループページに進む</Link>
    </div>
  );
}
