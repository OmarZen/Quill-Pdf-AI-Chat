import Dashboard from '@/components/Dashboard'
import { db } from '@/db'
// import { getUserSubscriptionPlan } from '@/lib/stripe'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'

const Page = async () => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if ( await !user || !(await user).id) {
    redirect('/auth-callback?origin=dashboard')
  }

  const dbUser = await db.user.findFirst({
    where: {
      id: (await user).id,
    }
  })

  if(await !dbUser) redirect('/auth-callback?origin=dashboard')

//   const subscriptionPlan = await getUserSubscriptionPlan()
  return <Dashboard />
}

export default Page