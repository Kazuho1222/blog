import Social from './social'

export default function Contact() {
	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold text-gray-900">Contact</h3>
			<Social iconSize="30px" />
			<address className="text-gray-600">cube@web.mail.address</address>
		</div>
	)
}
