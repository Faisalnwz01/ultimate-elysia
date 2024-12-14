import * as React from 'react'
import { Tailwind, Section, Text } from '@react-email/components'

export default function VerifyEmail({ email, otp }: { email: string; otp: string }) {
    return (
        <Tailwind>
            <Section className="flex justify-center items-center w-full min-h-screen font-sans">
                <Section className="flex flex-col items-center w-76 rounded-2xl px-6 py-1 bg-gray-50">
                    <Text className="text-xs font-medium text-violet-500">
                        Verify your Email Address
                    </Text>
                    <Text className="text-gray-500 my-0">
                        Please verify {email}
                    </Text>
                    <Text className="text-gray-500 my-0">
                        Use the following code to verify your email address
                    </Text>
                    <Text className="text-5xl font-bold pt-2">{otp}</Text>
                    <Text className="text-gray-400 font-light text-xs pb-4">
                        This code is valid for 10 minutes
                    </Text>
                    <Text className="text-gray-600 text-xs">
                        Thank you for joining us
                    </Text>
                </Section>
            </Section>
        </Tailwind>
    )
}

VerifyEmail.PreviewProps = {
    email: "user@example.com",
    otp: "123456"
}