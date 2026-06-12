import { Navbar } from "~/components/Navbar";

export default function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="page-bg" />
      <div className="page-content min-h-screen flex flex-col">
        <Navbar />

        <main className="home-main">
          <section className="home-frame">
            <div className="home-panel">
              <div className="home-logo">
                <div className="logo-font home-logo-line">TODO</div>
                <div className="logo-font home-logo-line">APP</div>
              </div>

              <div className="home-copy">
                <p className="home-description">
                  A todo app, designed minimalist workspace that clears the digital clutter,
                </p>

                <p className="home-tagline">
                  FOCUS. CLARITY.FLOW
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
