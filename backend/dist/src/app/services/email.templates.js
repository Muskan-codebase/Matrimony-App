"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.photoRequestEmail = exports.contactAlertEmail = exports.newMatchesEmail = exports.membershipExpiryEmail = void 0;
const membershipExpiryEmail = (firstName, expiryDate) => `
    <div>
        <h2>Membership Expiry Reminder</h2>

        <p>Hi ${firstName},</p>

        <p>
            Your SahaJeevan membership is expiring on
            <strong>${expiryDate}</strong>.
        </p>

        <p>
            Renew your membership to continue enjoying
            SahaJeevan's premium features.
        </p>

        <p>
            Regards,<br />
            SahaJeevan Team
        </p>
    </div>
`;
exports.membershipExpiryEmail = membershipExpiryEmail;
const newMatchesEmail = (firstName, matchCount) => `
    <div>
        <h2>New Matches Found!</h2>

        <p>Hi ${firstName},</p>

        <p>
            We found <strong>${matchCount}</strong>
            new profiles that match your preferences.
        </p>

        <p>
            Login to SahaJeevan to view your new matches.
        </p>

        <p>
            Regards,<br />
            SahaJeevan Team
        </p>
    </div>
`;
exports.newMatchesEmail = newMatchesEmail;
const contactAlertEmail = (firstName, senderName) => `
    <div>
        <h2>Someone Contacted You</h2>

        <p>Hi ${firstName},</p>

        <p>
            <strong>${senderName}</strong> has sent you a message.
        </p>

        <p>
            Login to SahaJeevan to view the message.
        </p>

        <p>
            Regards,<br />
            SahaJeevan Team
        </p>
    </div>
`;
exports.contactAlertEmail = contactAlertEmail;
const photoRequestEmail = (firstName, senderName) => `
    <div>
        <h2>Photo Request</h2>

        <p>Hi ${firstName},</p>

        <p>
            <strong>${senderName}</strong> has requested
            your photo.
        </p>

        <p>
            Login to SahaJeevan to respond to the photo request.
        </p>

        <p>
            Regards,<br />
            SahaJeevan Team
        </p>
    </div>
`;
exports.photoRequestEmail = photoRequestEmail;
