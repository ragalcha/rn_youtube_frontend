import { useEffect, useState } from 'react'
import HeroVideo from '../Components/Herovideo'
import { setCookie, getCookie, removeCookie } from '../utility/cookieUtils';
import Header from '../Components/Header';
import Movies from '../Components/Movies';
import Footer from '../Components/Footer';
function HomePage() {

  const [count, setCount] = useState(0)

  return (
    <>
        <div class="main clearfix position-relative">
          <Header />
          <HeroVideo />
          <Movies />
        </div>

        <Footer/>
    </>
  )
}

export default HomePage