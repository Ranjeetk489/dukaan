import { useRouter } from 'next/navigation'


type Props = {}

const Page = async (props: Props) => {
  const router = useRouter()
  router.push('/products')



  return (
    <div>

    </div>
  )
}

export default Page