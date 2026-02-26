import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

const Faqs = () => {
  return (
    <div className='mt-12 px-4 lg:px-0'>
        <div className='flex items-start lg:items-center justify-between mb-4 flex-col lg:flex-row'>
            <h3 className='text-3xl lg:text-5xl font-semibold lg:w-2/5'>Frequently Asked Questions</h3>
            <p className='lg:w-2/5 text-sm lg:text-md'>Quick answers to question you may have about RMB Deals. Can't find what you are looking for? Reach out to us on Whatapp.</p>
        </div>
        <hr className="block" />
        <div className='h-2 w-36 lg:w-96 relative block bg-[#FFDD66] -top-1'></div>
        <div className="lg:p-8 mt-8 lg:mt-0">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="md:py-8">
                    <AccordionTrigger className="md:text-xl">How Do I Know It Is Not A Scam?</AccordionTrigger>
                    <AccordionContent >
                        You can visit our office at Accra, Tabora Junction to make payment. Call 0244699112 for direction.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="md:py-8">
                    <AccordionTrigger className="md:text-xl">Which Type Of Accounts Can You Fund?</AccordionTrigger>
                    <AccordionContent>
                        We can pay into Alipay, or Chinese Bank Accounts.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="md:py-8">
                    <AccordionTrigger className="md:text-xl">How Fast Can You Fund My Account?</AccordionTrigger>
                    <AccordionContent>
                        RMB Deals can transfer as fast as 5 minutes within normal Chinese working Hours but we estimate up to 30 minutes. 
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="md:py-8">
                    <AccordionTrigger className="md:text-xl">Where Is Our Office Located?</AccordionTrigger>
                    <AccordionContent>
                        We are located at Accra, Achimota Mile 7, adjacent the Mile 7 Police Station. 
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5" className="md:py-8 ">
                    <AccordionTrigger className="md:text-xl">What Is Our Rate?</AccordionTrigger>
                    <AccordionContent>
                        Our rate is updated daily on the front page of this site. 
                        You can negotiate for all transactions above 10,000RMB.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    </div>
  )
}

export default Faqs
