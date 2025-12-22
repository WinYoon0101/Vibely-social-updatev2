import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Alert = ({ title, iconUrl }) => {
  return (
    <section className="flex-center h-screen w-full">
      <Card className="w-full max-w-[520px] border-none bg-[#1C1F2E] p-6 py-9 text-white">
        <CardContent>
          <div className="flex flex-col gap-9">
            <div className="flex flex-col gap-3.5">
              {iconUrl && (
                <div className="flex-center">
                  <Image
                    src={iconUrl}
                    width={72}
                    height={72}
                    alt="biểu tượng"
                  />
                </div>
              )}

              <p className="text-center text-xl font-semibold">
                {title}
              </p>
            </div>

            <Button asChild className="bg-[#0E78F9]">
              <Link href="/video-conferencing">Quay về trang chủ</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Alert;
