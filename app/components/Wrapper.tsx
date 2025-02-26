import { ToastContainer } from "react-toastify"
import Navbar from "./Navbar"

type WrapperProps = {
    children: React.ReactNode
}

const Wrapper = ({ children }: WrapperProps) => {
    return (
        <div data-theme="cmyk" >
            <Navbar />
            <div className="px-5 md:px-[10%] mt-4 mb-10" >
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    pauseOnHover
                    draggable
                />
                {children}
            </div>
        </div>
    )
}

export default Wrapper
