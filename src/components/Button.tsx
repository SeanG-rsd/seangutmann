import { useState } from "react";

const Button = () => {
    const [num, setNum] = useState(0)
    return (
        <button onClick={() => setNum(prev => prev + 1)} className="bg-red-500">
            Button {num}
        </button>
    )
}

export default Button;