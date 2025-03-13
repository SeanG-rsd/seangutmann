const InfoBlock = ({ content, title }: { content:string, title:string}) => {
    return (
        <div className="bg-red-400 w-screen flex justify-center flex-col">
            <h1 className="font-bold text-2xl p-2">{title}</h1>
            <p className="ml-3 p-2">{content}</p>
        </div>
    )
}

export default InfoBlock;