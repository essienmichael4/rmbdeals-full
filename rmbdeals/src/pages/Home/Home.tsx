import Header from '../../components/Header'
import Hero from '../../components/Hero'
import Features from '../../components/Features'
import Process from '../../components/Process'
import Footer from '../../components/Footer'
import Faqs from '@/components/Faqs'
import Rate from '@/components/Rate'
import { useState } from 'react'
import Announcement from '@/components/Announcement'

const Home = () => {
  const [height, setHeight] = useState<number>()

  return (
    <div className='w-full'>
      <Announcement setHeight={setHeight}/>
        <Header />
        <div className='mx-auto container -mt-20'>
            <Hero height={height}/>
            <Rate />
            <Features />
            <Process />
            <Faqs />
        </div>
        <Footer />
    </div>
  )
}

export default Home
