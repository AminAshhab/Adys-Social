import {
  Header,
  Hero,
  Services,
  Gallery,
  Profile,
  InquiryForm,
  Footer,
  useLenis,
} from '@/features/landing'

export default function App() {
  useLenis()

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Gallery />
        <Profile />
        <InquiryForm />
      </main>
      <Footer />
    </>
  )
}
