import * as React from 'react'
import {
    Tailwind,
    Section,
    Text,
    Container,
    Hr,
} from '@react-email/components'

export default function ResetPassword({
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
                        Password Reset Request
                    </Text>
                    <Text className="text-gray-600 mb-4 text-center">
                        We received a request to reset the password for your account ({email})
                    </Text>
                    <Section className="bg-gray-50 rounded-lg p-6 mb-4">
                        <Text className="text-center text-gray-600 mb-2">
                            To reset your password, enter this verification code:
                        </Text>
                        <Text className="text-4xl font-bold text-center text-violet-600 tracking-wide">
                            {otp}
                        </Text>
                    </Section>
                    <Text className="text-sm text-gray-500 text-center mb-2">
                        This verification code will expire in 10 minutes.
                    </Text>
                    <Text className="text-sm text-gray-500 text-center">
                        For your security, do not share this information with anyone.
                    </Text>
                    <Hr className="border-gray-200 my-4" />
                    <Text className="text-xs text-gray-400 text-center">
                        If you did not request this password reset, please secure your account immediately by changing your password and enabling two-factor authentication.
                    </Text>
                </Section>
            </Container>
        </Tailwind>
    )
}

ResetPassword.PreviewProps = {
    email: "user-email@email.com",
    otp: "123456",
}