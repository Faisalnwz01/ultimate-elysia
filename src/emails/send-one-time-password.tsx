import * as React from 'react'
import {
    Tailwind,
    Section,
    Text,
    Container,
    Hr,
} from '@react-email/components'

export default function SendOneTimePassword({
    email,
    otp,
}: {
    email: string
    otp: string
}) {
    return (
        <Tailwind>
            <Container className="bg-white my-auto mx-auto font-sans">
                <Section className="bg-white border border-gray-200 rounded-xl shadow-sm my-8 mx-auto p-8 max-w-xl">
                    <Text className="text-2xl font-bold text-gray-800 text-center mb-4">
                        Your One-Time Password
                    </Text>
                    <Text className="text-gray-600 mb-4 text-center">
                        A sign-in attempt requires further verification for {email}
                    </Text>
                    <Section className="bg-gray-50 rounded-lg p-6 mb-4">
                        <Text className="text-center text-gray-600 mb-2">
                            To complete the sign-in, enter this code:
                        </Text>
                        <Text className="text-4xl font-bold text-center text-violet-600 tracking-wide">
                            {otp}
                        </Text>
                    </Section>
                    <Text className="text-sm text-gray-500 text-center mb-2">
                        This one-time password will expire in 10 minutes.
                    </Text>
                    <Text className="text-sm text-gray-500 text-center">
                        For your security, do not share this code with anyone.
                    </Text>
                    <Hr className="border-gray-200 my-4" />
                    <Text className="text-xs text-gray-400 text-center">
                        If you did not attempt to sign in, please secure your account by changing your password immediately.
                    </Text>
                </Section>
            </Container>
        </Tailwind>
    )
}

SendOneTimePassword.PreviewProps = {
    email: "user@example.com",
    otp: "123456"
}
