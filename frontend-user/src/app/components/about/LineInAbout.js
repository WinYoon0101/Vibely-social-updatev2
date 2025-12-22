'use client';

const Line = () => {
    return (
        <div className="h-[1000px] md:h-[900px] lg:h-[850px] w-[10px]">
            <div className="absolute left-1/2">
                <div className="h-[1000px] md:h-[850px] lg:h-[800px] w-[10px] absolute bg-gradient-to-b 
                    from-white via-[#afe4ff] to-[#83bbff] left-[9px]" 
                />
                <div className="absolute bg-white border-8 border-[#7ad0ffba] rounded-full shadow-lg h-[28px] w-[28px] top-[80px]" />
                <div className="absolute bg-white border-8 border-[#7ad0ffba] rounded-full shadow-lg h-[28px] w-[28px] top-[370px]" />
                <div className="absolute bg-white border-8 border-[#7ad0ffba] rounded-full shadow-lg h-[28px] w-[28px] top-[670px]" />
            </div>
        </div>
    );
};

export default Line;