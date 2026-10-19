import crysCisenn from "../_assets/crys-cisenn.jpg"

/** Status "crystals" (stories-style rail). `img` is a URL or a data URL (user upload), null when text-only. */
export interface Crystal {
  name: string
  time: string
  text: string
  img: string | null
  likes: number
  comments: number
}

export const CRYSTALS: Crystal[] = [
  {
    name: "Cisenn W. Moire",
    time: "3 นาทีที่แล้ว",
    text: "เขียนจดหมายถึงตัวเองในอีก 10 ปี แล้วฝากไว้กับนกฮูก หวังว่ามันจะไม่ขโมยกิน",
    img: crysCisenn.src,
    likes: 2,
    comments: 1
  },
  {
    name: "Pinkberry Perlman",
    time: "26 นาทีที่แล้ว",
    text: "ตื่นดึก โต๊ะปูกิน ตื่นดึก โต๊ะปูกิน ชีวิตก็วนลูปแบบนี้แหละ",
    img: null,
    likes: 1,
    comments: 0
  },
  {
    name: "Lopez Zhou",
    time: "1 ชม.ที่แล้ว",
    text: "เปิดมาสะอึ๊ด รูปหายหมด T…T ใครเก็บแฟ้มรูปของเราไป",
    img: null,
    likes: 0,
    comments: 3
  },
  {
    name: "Nyx De Lacroix",
    time: "2 ชม.ที่แล้ว",
    text: "พลังงานเหลือ ▮▮▯ คืนนี้กลายร่างเป็นเด็กน้อยนอนหลับตั้งแต่ทุ่ม",
    img: null,
    likes: 4,
    comments: 0
  },
  {
    name: "Louisa B. Flozentine",
    time: "5 ชม.ที่แล้ว",
    text: "มันอาจจะอยู่คนเดียว แต่เรามีช็อกโกแลตกับผองเพื่อนทั้งสวน",
    img: null,
    likes: 1,
    comments: 2
  }
]
