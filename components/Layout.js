import { Briefcase, CircleUser, Headphones, Home, Layers3, LayoutTemplate, Menu, Settings } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useEffect } from 'react'

var startWorkAt = 2019

export default function Layout({ children }) {
  const pathname = usePathname()
  const params = useParams()

  useEffect(() => {

  }, [params])

  function genActive(pname, target) {
    if (`${pname}` !== target) { return null }

    // return `bg-yellow-200 rounded-lg`
    return `btn-active`
  }

  return(<>
    <div className="drawer drawer-oppen">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="w-full navbar bg-white border-b">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
              <Menu />
            </label>
          </div>
          <div className="flex-1 px-2 mx-2"><Headphones className='mr-2' /> VDUB</div>
          <div className="flex-none hidden lg:block">
            <ul className="menu menu-horizontal gap-1">
              {/* Navbar menu content here */}
              <li>
                <Link
                  className={`btn btn-sm btn-primary btn-outline ${genActive(pathname, "/")}`}
                  href="/"
                ><Home size={14}/> Home</Link>
              </li>
              <li>
                <Link
                  className={`btn btn-sm btn-primary btn-outline ${genActive(pathname, "/tasks")}`}
                  href="/tasks"
                ><LayoutTemplate size={14} /> Tasks</Link>
              </li>
              <li>
                <Link
                  className={`btn btn-sm btn-primary btn-outline ${genActive(pathname, "/setting")}`}
                  href="/setting"
                ><Settings size={14} /> Setting</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Page content here */}
        <main className='min-h-screen'>
          {children}
        </main>

        <footer className="footer p-10 bg-white border-t mt-6">
          <aside>
            <Link href="#">
              <Headphones size={46} />
            </Link>

            <p>VDUB<br/>Providing simple dubbing tools</p>
          </aside>
          {/* <nav>
            <h6 className="footer-title">Services</h6>
            <a className="link link-hover">Branding</a>
            <a className="link link-hover">Design</a>
            <a className="link link-hover">Marketing</a>
            <a className="link link-hover">Advertisement</a>
          </nav> */}
          {/* <nav>
            <h6 className="footer-title">Company</h6>
            <a className="link link-hover">About us</a>
            <a className="link link-hover">Contact</a>
            <a className="link link-hover">Jobs</a>
            <a className="link link-hover">Press kit</a>
          </nav> */}
          {/* <nav>
            <h6 className="footer-title">Legal</h6>
            <a className="link link-hover">Terms of use</a>
            <a className="link link-hover">Privacy policy</a>
            <a className="link link-hover">Cookie policy</a>
          </nav> */}
        </footer>
      </div>

      <div className="drawer-side z-50">
        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay z-40"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 z-50 gap-2">
          {/* Sidebar content here */}
          <li>
            <Link
              className={`btn btn-sm btn-primary btn-outline ${genActive(pathname, "/")}`}
              href="/"
            ><Home size={14}/> Home</Link>
          </li>
          <li>
            <Link
              className={`btn btn-sm btn-primary btn-outline ${genActive(pathname, "/tasks")}`}
              href="/tasks"
            ><LayoutTemplate size={14} /> Tasks</Link>
          </li>
        </ul>
      </div>
    </div>
  </>)
}
