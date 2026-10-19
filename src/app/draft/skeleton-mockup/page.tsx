import SkeletonRoot from "./_components/SkeletonRoot"
import HomeView from "./_components/home/HomeView"
import ForumsPage from "./_components/forums/ForumsPage"
import ForumDetailPage from "./_components/forums/ForumDetailPage"
import Footer from "./_components/Footer"

/**
 * Skeleton mock-up: grayscale wireframe of the forum main page (ported from veymour-athenaeum-thai-v2.html).
 * One route, three views (home / main forums / forum detail) switched with state, like the original HTML.
 */
export default function SkeletonMockupDraftPage() {
  return (
    <SkeletonRoot>
      <HomeView />
      <ForumsPage />
      <ForumDetailPage />
      <Footer />
    </SkeletonRoot>
  )
}
