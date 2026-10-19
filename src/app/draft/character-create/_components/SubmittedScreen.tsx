import Link from "next/link"
import { Flourish, InkDivider, SheetCorners, WaxSeal } from "@/components/Parchment"
import { routes } from "@/config/routes"
import DraftFrame from "./DraftFrame"

interface SubmittedScreenProps {
  displayName: string
}

/** Final screen after ยืนยันการสร้างตัวละคร — pending approval. */
export default function SubmittedScreen({ displayName }: SubmittedScreenProps) {
  return (
    <DraftFrame sub="— Pending Approval —" title="ส่งคำขอแล้ว">
      <div className="mx-auto max-w-md px-4 pt-10 sm:px-6">
        <div className="parch-sheet relative px-8 pt-12 pb-8 text-center sm:px-10">
          <SheetCorners />
          <WaxSeal letter="✓" size={72} className="seal-stamp mx-auto" />
          <h2 className="font-jimthompson mt-5 text-2xl text-[#3a2c1a]">ส่งคำขอเรียบร้อยแล้ว</h2>
          <div className="mx-auto max-w-[220px]">
            <InkDivider>
              <Flourish className="h-4 w-4" />
            </InkDivider>
          </div>
          <p className="font-display text-xl text-[#3a2c1a]">{displayName}</p>
          <p className="mt-4 font-ui text-[13.5px] leading-relaxed text-[#5d4626]">
            ตัวละครของคุณถูกส่งเข้าสู่กระบวนการตรวจสอบ กรุณารอการอนุมัติภายใน 3 วัน
          </p>
          <p className="mt-2 font-ui text-[11.5px] leading-relaxed text-[#a68d5f]">
            ทีมผู้ดูแลจะตรวจสอบความถูกต้องตามกฎแห่งหุบเขาก่อนประทับตรารับรอง
          </p>
          <Link href={routes.home} className="parch-btn mt-6 block">
            กลับสู่หมู่บ้าน
          </Link>
        </div>
      </div>
    </DraftFrame>
  )
}
