import React, { Suspense, useState, useEffect } from "react"
import { Route, Routes, Link, Navigate, useLocation } from "react-router-dom"

import SpinnerComponent from "./components/Spinner"
import Header from "./components/Header"
import Footer from "./components/Footer"

import * as lazyLoader from "./utils/lazyLoader"
// import { ToolsProviders, UserContext } from "./utils/ToolsPrividers"
import MessageFrame from "./components/MessageFrame"

import appsList from "./pages/appsList"
import { setTitleAndDescriptions } from "./utils/setTitleAndDescriptions"
import "./static/scss/main.scss";
import summaryCard from "./media/sns-big-summary.png"

const getAppName = path => {
  const currentApp = appsList.filter(app => app.linkTo == path)
  return currentApp[0]
}


const defaultMsgFrame = {
  msg: "", variant: "success"
}

const App = () => {
  const defaultApps = appsList
  const { pathname } = useLocation()
  const [outputApps, setOutputApps] = useState([...defaultApps])
  const [breadcrumbs, setBreadcrumbs] = useState("")
  const [searchShow, setSearchShow] = useState(true)
  const transferPage = () => {
    window.scrollTo(0, 0)
    if (pathname === "/") {
      setSearchShow(() => true)
      setBreadcrumbs("")
      setTitleAndDescriptions(
        "Fun Tools｜いろいろ使える便利ツールが揃ってます",
        "ReactとDjangoで作成したWebアプリです。便利なツールを揃えているので、ぜひ立ち寄ってみてください。作り方はブログで紹介しています！",
        "website",
        "https://tools.itc-app.site/",
        summaryCard
      )
    } else if (pathname === "/privacy-policy") {
      setSearchShow(() => false)
      setBreadcrumbs("Privacy Policy")
      setTitleAndDescriptions("プライバシーポリシー｜Fun Tools",
        "Fun Toolsのプライバシーポリシーポリシーです。",
        "article",
        "https://tools.itc-app.site/privacy-policy",
        summaryCard
      )
    } else if (pathname === "/contact") {
      setSearchShow(() => false)
      setBreadcrumbs("お問い合わせ")
      setTitleAndDescriptions("お問い合わせ｜Fun Tools",
        "Fun Toolsのお問い合わせページです。",
        "article",
        "https://tools.itc-app.site/contact",
        summaryCard
      )
    } else {
      setSearchShow(() => false)
      let p = pathname
      const last_slash = p.slice(-1) === "/"
      if (last_slash) {
        p = p.slice(0, -1)
      }
      const appOBJ = getAppName(p)
      setBreadcrumbs(appOBJ.appName)
      const pageTitle = appOBJ.appName + "｜Fun Tools"
      setTitleAndDescriptions(pageTitle,
        appOBJ.description,
        "article",
        "https://tools.itc-app.site" + appOBJ.linkTo,
        summaryCard
      )
    }
    document.getElementById("searchForm").value = ""
    setOutputApps([...defaultApps])
  }

  useEffect(() => {
    var searchBar = document.getElementById("searchDiv")
    if (searchShow) {
      searchBar.classList.remove("d-none")
    } else {
      searchBar.classList.add("d-none")
    }
  }, [searchShow])

  const [msgFrame, setMsgFrame] = useState(defaultMsgFrame)
  const toggleMessage = (msg, variant) => {
    setMsgFrame({ msg: msg, variant: variant })
    setTimeout(() => {
      setMsgFrame(defaultMsgFrame)
    }, 8000)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [msgFrame])

  return (
    <>
      <Header setOutputApps={setOutputApps} defaultApps={defaultApps} searchShow={searchShow} />
      <MessageFrame msgFrame={msgFrame} />
      {!searchShow &&
        <div className="breadcrumbs">
          <Link to="/">HOME</Link> &gt; {breadcrumbs}
        </div>
      }
      <main>
        <Suspense fallback={<SpinnerComponent />}>
          <Routes>
            <Route exact path="qrmaker" element={<lazyLoader.Qrmaker transferPage={transferPage} />} />
            {/* <Route exact path="/faviconmaker" element={<lazyLoader.FaviconMaker />} /> */}
            <Route path="heicConverter" element={<lazyLoader.HeicConverter transferPage={transferPage} />} />
            <Route exact path="change-pics-size" element={<lazyLoader.PicSizeChanger transferPage={transferPage} />} />
            <Route exact path="yearConverter" element={<lazyLoader.YearConverter transferPage={transferPage} />} />
            <Route exact path="blog-cloud" element={<lazyLoader.BlogCloud transferPage={transferPage} />} />
            <Route exact path="get-trends" element={<lazyLoader.TwitterTrends transferPage={transferPage} />} />
            <Route exact path="get-random-string" element={<lazyLoader.RandomStringGenerator transferPage={transferPage} />} />
            <Route exact path="wordcounter" element={<lazyLoader.WordCounter transferPage={transferPage} />} />
            <Route exact path="hashapp" element={<lazyLoader.Hashapp transferPage={transferPage} />} />
            <Route exact path="privacy-policy-maker" element={<lazyLoader.PrivacyPolicyMaker transferPage={transferPage} />} />
            <Route exact path="byte-counter" element={<lazyLoader.ByteCounter transferPage={transferPage} />} />
            <Route exact path="json-prettier" element={<lazyLoader.JsonPretty transferPage={transferPage} />} />
            <Route exact path="pomodoro-timer" element={<lazyLoader.Pomodoro transferPage={transferPage} />} />
            <Route exact path="privacy-policy" element={<lazyLoader.PrivacyPolicy transferPage={transferPage} />} />
            <Route exact path="contact" element={<lazyLoader.Contact setMsgFrame={setMsgFrame} toggleMessage={toggleMessage} transferPage={transferPage} />} />

            <Route path="*" element={<lazyLoader.Error404 transferPage={transferPage} />} />
            <Route path="/" element={<lazyLoader.LandingPage outputApps={outputApps} transferPage={transferPage} />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
export default App

