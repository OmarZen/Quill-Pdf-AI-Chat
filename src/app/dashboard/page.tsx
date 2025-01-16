import Dashboard from '@/components/Dashboard'
import { db } from '@/db'
// import { getUserSubscriptionPlan } from '@/lib/stripe'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'

export const dynamic = "force-dynamic"; // Ensure the page is rendered dynamically

const Page = async () => {
  const { getUser } = getKindeServerSession()
  const user = getUser()

  if (!user || !(await user)?.id) {
    redirect("/auth-callback?origin=dashboard");
    return null; // Ensure no further rendering occurs
  }

  const dbUser = await db.user.findFirst({
    where: {
      id: (await user).id,
    }
  })

  if (!dbUser) {
    redirect("/auth-callback?origin=dashboard");
    return null; // Ensure no further rendering occurs
  }

//   const subscriptionPlan = await getUserSubscriptionPlan()
  return <Dashboard />
}

export default Page