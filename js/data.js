/**
 * data.js — Cyber Shield v2.0 Enhanced Game Data
 * Full simulation scenarios with email/phone/browser/ransomware UIs,
 * compliance mappings (ISO 27001 · NCA ECC · SAMA CSF), and
 * decision consequences for every question.
 */

const GAME_DATA = {

  levels: [

    /* ================================================================
       LEVEL 1 — Phishing Email Detection  (Email Simulator UI)
    ================================================================ */
    {
      id: 1,
      title: "Phishing Email Detection",
      description: "Interact with realistic phishing emails. Identify red flags before it's too late.",
      icon: "🎣",
      color: "#ff6b6b",
      badge: { name: "Phishing Master", icon: "🛡️", description: "Expert at spotting phishing attempts before they hook you" },

      questions: [
        {
          id: "q1_1",
          type: "email",
          hint: "Examine the sender's email domain character by character — look for substituted letters or numbers.",

          emailUI: {
            client: "Outlook",
            from: { displayName: "Bank of America — Security Alert", address: "security@bank-0f-america.com" },
            to: "ahmed.rashidi@yourcompany.com",
            subject: "⚠️ URGENT: Your Account Has Been SUSPENDED — Verify Immediately",
            date: "Mon, Mar 18, 2026, 11:47 PM",
            priority: "high",
            body: [
              { type: "p", text: "Dear Valued Customer," },
              { type: "p", html: "We have detected <strong>suspicious login activity</strong> on your Bank of America account. For your protection, your account has been <span class='em-threat'>TEMPORARILY SUSPENDED</span>." },
              { type: "p", text: "To restore full access you must verify your identity within 2 hours. Failure to act will result in your account being permanently closed and your balance frozen pending investigation." },
              { type: "link", text: "🔒 Click Here to Secure & Verify Your Account →", realUrl: "http://bank-0f-america.com/verify?token=xA8k&capture=credentials" },
              { type: "divider" },
              { type: "footer", text: "Bank of America, N.A. | Member FDIC | © 2026 Bank of America Corporation | 100 N Tryon St, Charlotte, NC 28255 | This is an automated security notification." }
            ],
            attachments: [],
            redFlags: [
              { icon: "🔴", category: "Domain Spoofing",      text: "Sender domain is 'bank-0f-america.com' — digit '0' replaces the letter 'o'. A classic lookalike domain attack." },
              { icon: "🟠", category: "Urgency Manipulation", text: "2-hour deadline is artificial psychological pressure designed to bypass rational thinking." },
              { icon: "🔴", category: "Malicious Link",       text: "Hover the link — it leads to an attacker-controlled server, not bankofamerica.com." },
              { icon: "🟡", category: "Threat Tactics",       text: "Threatening permanent account closure forces panic-driven decisions." },
              { icon: "🟡", category: "Policy Violation",     text: "Legitimate banks never request credential verification via email links — ever." }
            ]
          },

          question: "What should you do with this email?",
          options: [
            "Click the verification link — your account may genuinely be suspended",
            "Reply asking for more details and their employee reference number",
            "Delete the email and contact Bank of America directly via their official website or the number on your card",
            "Forward it to your contacts to warn them about this scam"
          ],
          hardOptions: [
            "Open the link in Incognito mode — your browsing data won't be recorded",
            "Reply and provide credentials so they can restore access before the 2-hour deadline",
            "Delete the email and contact Bank of America directly via their official website or the number on your card",
            "Forward it to your company's IT security team for them to investigate on your behalf"
          ],
          correct: 2,
          points: 20,

          wrongConsequence: {
            type: "breach",
            title: "ACCOUNT COMPROMISED",
            subtitle: "Phishing Attack — Credentials Captured",
            description: "You clicked the phishing link and entered your credentials on the fake site. Attackers now have full access to your bank account.",
            impacts: [
              "Banking username & password captured in real time",
              "Unauthorised transfer of $12,500 initiated within minutes",
              "Personal data listed on dark web marketplace within 48 hours",
              "Account frozen — fraud investigation opened",
              "Credit monitoring advisory issued — identity theft risk elevated"
            ]
          },
          correctConsequence: {
            type: "prevented",
            title: "THREAT NEUTRALIZED",
            subtitle: "Phishing Attack Deflected",
            description: "Excellent awareness! You correctly identified the phishing attempt and reported it through official channels.",
            prevented: [
              "Credential capture attempt blocked",
              "Banking account remains fully secure",
              "IT Security team alerted — domain reported to CERT",
              "Phishing campaign disrupted before targeting others"
            ]
          },

          explanation: "Textbook phishing using 5 red flags: (1) Typosquatted domain 'bank-0f-america.com' — digit '0' not letter 'O'. (2) 2-hour artificial urgency. (3) Permanent closure threat. (4) Link leads to attacker's server (hover to see real URL). (5) Legitimate banks never request credentials via email. Always contact your bank directly through official channels.",
          tip: "Hover over links before clicking to inspect the real destination URL. The HTTPS padlock only confirms encryption — not that the site is legitimate.",

          compliance: {
            iso27001: [
              { control: "A.7.2.2", title: "Information Security Awareness, Education & Training" },
              { control: "A.13.2.3", title: "Electronic Messaging Security" }
            ],
            nca_ecc: [
              { control: "ECC-1-4-3", title: "Cybersecurity Awareness & Training" },
              { control: "ECC-2-3-1", title: "Electronic Mail Security Controls" }
            ],
            sama: [
              { control: "3.3.5", title: "Security Awareness & Training Program" },
              { control: "3.3.7", title: "Email Security Management" }
            ]
          }
        },

        {
          id: "q1_2",
          type: "email",
          hint: "No legitimate IT department will ever ask for your password via email. Check the sender's domain carefully.",

          emailUI: {
            client: "Outlook",
            from: { displayName: "IT Helpdesk — Systems Team", address: "it-support@yourcompany-helpdesk.net" },
            to: "all.employees@yourcompany.com",
            subject: "ACTION REQUIRED: Critical Security Upgrade — Account Migration by 5 PM Today",
            date: "Fri, Mar 20, 2026, 2:15 PM",
            priority: "high",
            body: [
              { type: "p", text: "Dear Team Member," },
              { type: "p", html: "Our IT department is performing a <strong>critical security infrastructure upgrade</strong> this weekend. All user accounts must be migrated to the new secure authentication platform before Monday." },
              { type: "p", html: "To complete your migration, please <strong>reply to this email with your current username and password</strong> before 5:00 PM today." },
              { type: "p", text: "If you do not provide your credentials, your account will be automatically locked out of all company systems starting Monday at 8:00 AM." },
              { type: "divider" },
              { type: "footer", text: "IT Department | Your Company | Ref: INC-2026-0891 | This is an internal automated notification." }
            ],
            attachments: [],
            redFlags: [
              { icon: "🔴", category: "Password Request",   text: "Legitimate IT departments NEVER ask for passwords via email — this is the single biggest red flag of credential phishing." },
              { icon: "🔴", category: "External Domain",    text: "'yourcompany-helpdesk.net' is an external domain — your real IT would email from '@yourcompany.com'." },
              { icon: "🟠", category: "Mass Target",        text: "Sent to 'all.employees' — real IT requests are targeted, go through ticketing systems, not mass emails." },
              { icon: "🟡", category: "Deadline Pressure",  text: "End-of-day deadline is designed to prevent careful verification and push for quick compliance." }
            ]
          },

          question: "What is the correct response to this email?",
          options: [
            "Reply with your credentials — IT needs them urgently for the upgrade",
            "Change your password first, then share the new one so IT can complete the migration",
            "Refuse and immediately report this email to your real IT department via official internal channels",
            "Ask them to resend the request from your company's official email domain first"
          ],
          hardOptions: [
            "Provide your username but send a temporary one-time password for the migration only",
            "Reply via email asking for the IT manager's name and employee ID before sharing anything",
            "Refuse and immediately report this email to your real IT department via official internal channels",
            "Forward to your manager so they can verify with IT leadership before you respond"
          ],
          correct: 2,
          points: 25,

          wrongConsequence: {
            type: "breach",
            title: "CREDENTIALS HARVESTED",
            subtitle: "Business Email Compromise (BEC)",
            description: "You replied with your credentials. The attacker now has full access to your corporate account and everything connected to it.",
            impacts: [
              "Corporate email account fully compromised",
              "Attacker exfiltrated confidential client data and contracts",
              "Malicious emails sent to clients and partners from your account",
              "VPN and internal systems accessed using your credentials",
              "Regulatory notification required — potential GDPR/NCA breach incident"
            ]
          },
          correctConsequence: {
            type: "prevented",
            title: "ATTACK THWARTED",
            subtitle: "Credential Harvesting Prevented",
            description: "Correct! You refused to share credentials and reported to real IT security. This stopped a potential BEC attack.",
            prevented: [
              "Corporate credential compromise prevented",
              "Internal systems remain secure",
              "IT security team investigated and blocked attacker's domain",
              "Security awareness bulletin issued company-wide"
            ]
          },

          explanation: "Legitimate IT departments NEVER ask for passwords via email — ever. Key red flags: (1) External domain 'yourcompany-helpdesk.net' not '@yourcompany.com'. (2) Sent to all.employees — real IT uses ticketing systems. (3) Password requests are always a red flag regardless of claimed urgency. Report immediately through your real IT's official channel.",
          tip: "Verify all IT requests by calling your IT helpdesk directly using the number from your internal directory — never reply to the suspicious email.",

          compliance: {
            iso27001: [
              { control: "A.9.3.1", title: "Use of Secret Authentication Information" },
              { control: "A.7.2.2", title: "Information Security Awareness & Training" }
            ],
            nca_ecc: [
              { control: "ECC-1-4-3", title: "Cybersecurity Awareness & Training" },
              { control: "ECC-2-6-1", title: "Identity & Access Management" }
            ],
            sama: [
              { control: "3.3.4", title: "Identity & Access Management" },
              { control: "3.3.5", title: "Security Awareness & Training Program" }
            ]
          }
        },

        {
          id: "q1_3",
          type: "email",
          hint: "Check the sender domain against the official company domain. 'Free' prizes that require payment are always scams.",

          emailUI: {
            client: "Gmail",
            from: { displayName: "Amazon Customer Rewards Center", address: "rewards@amazon-gifts-promo.info" },
            to: "lucky.winner992@gmail.com",
            subject: "🎁 Congratulations! Your $500 Amazon Gift Card is Ready — Claim Within 24 Hours",
            date: "Sun, Mar 16, 2026, 9:23 AM",
            priority: "normal",
            body: [
              { type: "p", html: "🎊 <strong>CONGRATULATIONS!</strong>" },
              { type: "p", text: "You've been SELECTED from millions of Amazon customers as this month's loyalty reward winner! Your exclusive $500 Amazon Gift Card is reserved and waiting for you." },
              { type: "p", text: "This reward expires in 24 HOURS. If unclaimed, your gift card will be reassigned to another eligible customer." },
              { type: "link", text: "🎁 Claim Your $500 Gift Card Now →", realUrl: "http://amazon-gifts-promo.info/claim?id=winner992&step=ccverify" },
              { type: "p", html: "<em style='color:#888;font-size:12px'>Note: A valid credit card is required for age verification and to cover the $3.99 processing and handling fee.</em>" },
              { type: "divider" },
              { type: "footer", text: "Amazon Rewards Centre | amazon-gifts-promo.info | Unsubscribe | Privacy" }
            ],
            attachments: [],
            redFlags: [
              { icon: "🔴", category: "Fake Domain",         text: "'amazon-gifts-promo.info' is NOT amazon.com — attackers register convincing-sounding domains to impersonate brands." },
              { icon: "🔴", category: "Advance-Fee Fraud",   text: "Requesting credit card details for a 'free' prize is the textbook advance-fee fraud pattern." },
              { icon: "🟠", category: "Unsolicited Prize",   text: "You never entered any Amazon promotion — you cannot win something you didn't enter." },
              { icon: "🟡", category: "Urgency & Scarcity",  text: "24-hour expiry and 'reassignment threat' are psychological pressure techniques to bypass rational judgment." }
            ]
          },

          question: "How do you classify this email?",
          options: [
            "Legitimate — Amazon frequently rewards loyal customers with surprise gift cards",
            "Suspicious, but worth clicking to check if the offer is real",
            "A phishing / advance-fee scam — delete it immediately without clicking any links",
            "A marketing email — clicking 'Unsubscribe' at the bottom will stop future emails"
          ],
          hardOptions: [
            "Potentially legitimate — verify by searching for 'Amazon Loyalty Rewards' online first",
            "Worth investigating — click in a private browser and don't enter payment details unless it looks real",
            "A phishing / advance-fee scam — delete it immediately without clicking any links",
            "Spam marketing — safe to unsubscribe since they know your email anyway"
          ],
          correct: 2,
          points: 15,

          wrongConsequence: {
            type: "scam",
            title: "FINANCIAL FRAUD",
            subtitle: "Advance-Fee / Phishing Scam",
            description: "You clicked the link and entered your credit card details for the 'verification fee'. The attackers now have your financial information.",
            impacts: [
              "Credit card number, CVV, and expiry date captured",
              "Card charged $3.99 — then $149.99 'membership fee' next month",
              "Card data sold on carding forums within hours",
              "Fraudulent purchases totalling $2,340 made internationally",
              "Bank dispute filed — 10–15 day resolution period, card cancelled"
            ]
          },
          correctConsequence: {
            type: "prevented",
            title: "SCAM AVOIDED",
            subtitle: "Advance-Fee Fraud Deflected",
            description: "Well done! You correctly identified this as a scam and avoided financial and data loss.",
            prevented: [
              "Credit card data remains secure",
              "No financial loss incurred",
              "Phishing domain reported to Amazon abuse team",
              "Scam awareness shared with colleagues"
            ]
          },

          explanation: "Classic advance-fee / phishing scam with 4 red flags: (1) 'amazon-gifts-promo.info' is NOT amazon.com — always check the exact domain. (2) Prizes require payment = immediate red flag. (3) You can't win something you never entered. (4) Urgency prevents rational thought. Clicking 'Unsubscribe' on scam emails confirms your address is active and invites more attacks.",
          tip: "Legitimate Amazon gift cards and promotions only come from @amazon.com addresses. Never pay anything to claim a 'free' prize.",

          compliance: {
            iso27001: [
              { control: "A.7.2.2", title: "Information Security Awareness & Training" }
            ],
            nca_ecc: [
              { control: "ECC-1-4-3", title: "Cybersecurity Awareness & Training" },
              { control: "ECC-2-3-1", title: "Electronic Mail Security" }
            ],
            sama: [
              { control: "3.3.5", title: "Security Awareness & Training Program" }
            ]
          }
        }
      ]
    },

    /* ================================================================
       LEVEL 2 — Password Security Challenge
    ================================================================ */
    {
      id: 2,
      title: "Password Security Challenge",
      description: "Master password hygiene, credential stuffing risks, and modern authentication threats.",
      icon: "🔐",
      color: "#4ecdc4",
      badge: { name: "Password Pro", icon: "🔑", description: "Champion of strong password practices and MFA security" },

      questions: [
        {
          id: "q2_1",
          type: "scenario",
          hint: "Password length is the biggest factor in strength. Look for the longest option with mixed character types.",

          scenario: `SCENARIO: Creating a Banking Password

Your financial institution requires a strong password for their new secure portal. Their policy requires: minimum 12 characters, uppercase, lowercase, numbers, and special characters.

You are creating your password now. Which of the following meets the strongest security standard?`,

          question: "Which password provides the highest level of security?",
          options: [
            "Password123!  (11 chars — common dictionary variant)",
            "MyDog$Buddy2019  (15 chars — personal information based)",
            "Tr@vel#Mount@in$Sunrise99!  (25 chars — complex passphrase)",
            "p@$$w0rd  (8 chars — common leet substitution)"
          ],
          hardOptions: [
            "C0mplex!P@ss#99  (15 chars — mixed complexity)",
            "MyDog$Buddy2019!  (16 chars — personal information with special char)",
            "Tr@vel#Mount@in$Sunrise99!  (25 chars — complex passphrase)",
            "Qx9!mK#2vL@p  (12 chars — random characters, meets minimum)"
          ],
          correct: 2,
          points: 15,

          wrongConsequence: {
            type: "breach",
            title: "PASSWORD CRACKED",
            subtitle: "Weak Credential Compromise",
            description: "The password you selected was cracked using a combination of dictionary attack and credential stuffing techniques.",
            impacts: [
              "Password cracked in 47 minutes using GPU-based brute force",
              "Banking account accessed — transaction history reviewed",
              "Personal details harvested for identity theft",
              "Password found in known breach databases (HaveIBeenPwned)",
              "All accounts using this password now at risk"
            ]
          },
          correctConsequence: {
            type: "prevented",
            title: "ACCOUNT SECURED",
            subtitle: "Strong Password Protects Access",
            description: "Excellent choice! A 25-character complex passphrase would take trillions of years to crack with current technology.",
            prevented: [
              "Brute force attack: estimated 3.4 × 10²⁶ years to crack",
              "Not present in any known breach database",
              "Meets NIST SP 800-63B guidelines",
              "Banking account secured with maximum credential strength"
            ]
          },

          explanation: "'Tr@vel#Mount@in$Sunrise99!' is the strongest at 25 characters with all four character classes. 'Password123!' and 'p@$$w0rd' appear on every breach list. 'MyDog$Buddy2019' uses predictable personal info visible on social media. Length is the primary factor — a 25-char passphrase is exponentially stronger than a 12-char complex password.",
          tip: "Use a password manager to generate truly random passwords of 20+ characters. You only need to remember one master password.",

          compliance: {
            iso27001: [
              { control: "A.9.4.3", title: "Password Management System" }
            ],
            nca_ecc: [
              { control: "ECC-2-6-1", title: "Identity & Access Management" }
            ],
            sama: [
              { control: "3.3.4", title: "Identity & Access Management" }
            ]
          }
        },

        {
          id: "q2_2",
          type: "scenario",
          hint: "Think about what happens when a single website in a chain of reused passwords is breached.",

          scenario: `SCENARIO: Password Reuse — Credential Stuffing Risk

Your colleague Khalid mentions proudly: "I've been using the same 20-character password for the past 5 years across my work email, banking, LinkedIn, Netflix, and personal Gmail. It's incredibly strong — I even checked it against HaveIBeenPwned and it shows green!"

He asks you if this approach is safe.`,

          question: "What is the critical security risk Khalid is overlooking?",
          options: [
            "No real risk — a strong password is safe regardless of where it is reused",
            "If any one of those services suffers a breach, all his accounts become instantly vulnerable via credential stuffing attacks",
            "The risk is only significant if he shares the password with another person",
            "Minor concern — automated attackers rarely test credentials across different platforms"
          ],
          hardOptions: [
            "Low risk — because the password hasn't appeared in any breach database yet, it remains safe across sites",
            "If any one of those services suffers a breach, all his accounts become instantly vulnerable via credential stuffing attacks",
            "The risk applies only to lower-security sites — banking passwords are verified more strictly",
            "Moderate risk — but manageable if he enables notifications for suspicious login attempts"
          ],
          correct: 1,
          points: 20,

          wrongConsequence: {
            type: "breach",
            title: "CREDENTIAL STUFFING ATTACK",
            subtitle: "Multi-Account Cascade Compromise",
            description: "LinkedIn was breached. Within 4 hours, Khalid's identical password was used to compromise all his other accounts.",
            impacts: [
              "LinkedIn breach exposed password hash — cracked in 2 hours",
              "Banking account drained of $34,200 overnight",
              "Work email compromised — confidential client data exfiltrated",
              "Personal identity documents accessed via Gmail",
              "Netflix used to harvest additional personal/payment information"
            ]
          },
          correctConsequence: {
            type: "prevented",
            title: "RISK IDENTIFIED",
            subtitle: "Credential Stuffing Prevention",
            description: "You correctly identified the credential stuffing risk and Khalid switched to a password manager with unique passwords.",
            prevented: [
              "Cascade account compromise prevented",
              "Unique passwords mean breach of one site doesn't affect others",
              "Password manager generates cryptographically random credentials",
              "Khalid enrolled in MFA across all critical accounts"
            ]
          },

          explanation: "Credential stuffing is among the top 3 attack methods globally. When a site is breached — and thousands are breached every year — attackers automatically test the stolen email+password pair against hundreds of other services in minutes. Even a 'strong' password is catastrophically dangerous when reused. The HaveIBeenPwned check only shows *known* breaches.",
          tip: "Use Bitwarden (free) or 1Password to generate and store a unique random password for every service. You'll never need to remember individual passwords.",

          compliance: {
            iso27001: [
              { control: "A.9.4.3", title: "Password Management System" },
              { control: "A.9.2.4", title: "Management of Secret Authentication of Users" }
            ],
            nca_ecc: [
              { control: "ECC-2-6-1", title: "Identity & Access Management" }
            ],
            sama: [
              { control: "3.3.4", title: "Identity & Access Management" }
            ]
          }
        },

        {
          id: "q2_3",
          type: "scenario",
          hint: "Consider which method requires physical possession AND cannot be intercepted over the network.",

          scenario: `SCENARIO: Choosing the Strongest 2FA Method

Your organisation is rolling out multi-factor authentication (MFA) across all critical systems. The vendor offers four options for the second factor:

Option A: SMS code sent to registered mobile number
Option B: Time-based code from an authenticator app (Google Authenticator / Authy)
Option C: Hardware security key (YubiKey / FIDO2)
Option D: Email-based one-time code sent to backup address`,

          question: "Which 2FA method should you recommend as the strongest?",
          options: [
            "SMS code — convenient and widely supported across all services",
            "Email OTP — you already protect your email with a strong password",
            "Authenticator App — generates offline codes, unaffected by network attacks",
            "Hardware Security Key (FIDO2/YubiKey) — cryptographic verification requiring physical possession"
          ],
          hardOptions: [
            "SMS code — telecom carriers verify identity making it more trustworthy than apps",
            "Email OTP — two-layer verification as both email and the code are needed",
            "Authenticator App — industry standard, time-based OTP is unphishable",
            "Hardware Security Key (FIDO2/YubiKey) — cryptographic verification requiring physical possession"
          ],
          correct: 3,
          points: 30,

          wrongConsequence: {
            type: "breach",
            title: "2FA BYPASSED",
            subtitle: "SIM-Swap / Phishing Attack",
            description: "The attacker performed a SIM-swap or real-time phishing relay attack to bypass the weaker 2FA method chosen.",
            impacts: [
              "SIM-swap completed via social engineering at mobile carrier",
              "SMS one-time codes now received by attacker's device",
              "Banking and email accounts bypassed despite 2FA being enabled",
              "Real-time phishing proxy intercepted authenticator codes",
              "All accounts protected only by this 2FA method now compromised"
            ]
          },
          correctConsequence: {
            type: "prevented",
            title: "2FA UNBREAKABLE",
            subtitle: "Hardware Key Prevents Bypass",
            description: "The FIDO2 hardware key stopped the attack completely — it cryptographically verifies the real domain and requires physical touch.",
            prevented: [
              "Phishing attack failed — key refused to authenticate on fake domain",
              "SIM-swap irrelevant — no SMS codes used",
              "Real-time proxy attacks impossible against FIDO2 protocol",
              "Account access requires physical key possession — unbypassable remotely"
            ]
          },

          explanation: "Hardware security keys (FIDO2/WebAuthn) are unphishable — they cryptographically bind to the exact registered domain, refusing to authenticate on lookalike sites. They can't be SIM-swapped, intercepted, or relayed in real time. Authenticator apps are strong second choice. SMS is the weakest: SIM-swapping attacks are trivially accessible to moderately skilled attackers.",
          tip: "Rank 2FA methods: Hardware Key > Authenticator App > Email OTP > SMS. Enable the strongest method your service supports.",

          compliance: {
            iso27001: [
              { control: "A.9.3.1", title: "Use of Secret Authentication Information" },
              { control: "A.9.4.2", title: "Secure Log-On Procedures" }
            ],
            nca_ecc: [
              { control: "ECC-2-6-1", title: "Identity & Access Management" }
            ],
            sama: [
              { control: "3.3.4", title: "Identity & Access Management" }
            ]
          }
        }
      ]
    },

    /* ================================================================
       LEVEL 3 — Social Engineering Defense
    ================================================================ */
    {
      id: 3,
      title: "Social Engineering Defense",
      description: "Detect and resist psychological manipulation tactics across phone, physical, and digital scenarios.",
      icon: "🧠",
      color: "#a855f7",
      badge: { name: "Mind Guard", icon: "🧠", description: "Highly resistant to social engineering and manipulation" },

      questions: [
        {
          id: "q3_1",
          type: "phone",
          hint: "No legitimate technology company makes unsolicited calls about viruses on your device.",

          phoneUI: {
            caller: "MICROSOFT SUPPORT",
            number: "+1 (800) 642-7676",
            spoofed: true,
            script: [
              "\"Hello, this is David Thompson, Senior Security Engineer at Microsoft Support.\"",
              "\"Our systems have detected a critical virus infection on your Windows PC — it's actively exfiltrating your files and banking data right now.\"",
              "\"I need you to install our remote access tool immediately so we can neutralise the threat before you lose everything.\"",
              "\"Please open your browser and go to 'support-microsoft-help.com' — type it exactly as I say...\""
            ]
          },

          scenario: `PHONE CALL — Incoming: MICROSOFT SUPPORT (+1-800-642-7676)

"Hello, this is David Thompson from Microsoft Support. Our servers have detected a critical virus on your Windows PC that is actively stealing your banking credentials and personal files. I need remote access immediately to stop the damage before it's too late. Please install our remote support tool now..."`,

          question: "What is the correct response to this call?",
          options: [
            "Follow the caller's instructions — Microsoft monitors for viruses and this sounds urgent",
            "Ask for their employee ID and call Microsoft back using the number from their official website",
            "Hang up immediately — this is a tech support scam, Microsoft does not make unsolicited calls",
            "Allow remote access but monitor carefully what actions the technician performs"
          ],
          hardOptions: [
            "Stay on the line and ask them to prove they work for Microsoft by answering security questions",
            "Allow read-only remote access to verify the problem, but refuse any changes until confirmed",
            "Hang up immediately — this is a tech support scam, Microsoft does not make unsolicited calls",
            "Ask for their supervisor and a case reference number before proceeding with anything"
          ],
          correct: 2,
          points: 20,

          wrongConsequence: {
            type: "breach",
            title: "SYSTEM COMPROMISED",
            subtitle: "Tech Support Scam — Remote Access Granted",
            description: "You allowed remote access. The 'technician' installed malware, harvested credentials, and charged $499 for fake 'repairs'.",
            impacts: [
              "Remote Access Trojan (RAT) installed — persistent backdoor created",
              "Banking credentials and saved browser passwords extracted",
              "Fake 'lifetime protection plan' charged $499 to credit card",
              "Ransomware deployed — files encrypted 3 days later",
              "Device used as botnet node for further attacks"
            ]
          },
          correctConsequence: {
            type: "prevented",
            title: "SCAM BLOCKED",
            subtitle: "Tech Support Fraud Thwarted",
            description: "Correct! Microsoft never makes unsolicited support calls. Hanging up immediately was the right response.",
            prevented: [
              "Remote access trojan installation prevented",
              "Banking credentials remain secure",
              "No fraudulent charges incurred",
              "Scam reported to national cybercrime unit"
            ]
          },

          explanation: "Microsoft, Apple, Google and all legitimate tech companies NEVER make unsolicited calls about viruses on your device. These scammers use caller ID spoofing to appear as real companies. They install real malware, steal banking credentials, or charge hundreds for fake 'fixes'. Hang up immediately. The number on screen proves nothing — caller ID is trivially spoofed.",
          tip: "If genuinely concerned, hang up and call the company yourself using the number from their official website — never the number provided by the caller.",

          compliance: {
            iso27001: [
              { control: "A.7.2.2", title: "Information Security Awareness & Training" }
            ],
            nca_ecc: [
              { control: "ECC-1-4-3", title: "Cybersecurity Awareness & Training" }
            ],
            sama: [
              { control: "3.3.5", title: "Security Awareness & Training Program" }
            ]
          }
        },

        {
          id: "q3_2",
          type: "scenario",
          hint: "Physical access controls protect the same assets as digital security. Your badge-in policy exists for a reason.",

          scenario: `SCENARIO: Physical Tailgating / Piggybacking Attack

You badge through the secured entrance to your company's office floor. A person in a sharp business suit walks directly behind you and slips through the door before it closes. They smile confidently and say:

"Thanks! I left my access badge in my car — I'm here for the board meeting. Don't want to be late!"

They begin walking confidently toward the executive floor.`,

          question: "What is the security-correct response in this situation?",
          options: [
            "Let them proceed — they look professional, seem confident, and are likely a genuine visitor",
            "Hold the door since they look rushed — it would be socially awkward to challenge them",
            "Politely ask them to return to reception to sign in and receive a visitor badge, or offer to escort them personally",
            "Ignore the situation — enforcing physical security is the receptionist's job, not yours"
          ],
          hardOptions: [
            "Let them proceed but mention it to your manager later as a precautionary note",
            "Ask their name and company, then allow them in if the answer sounds plausible",
            "Politely ask them to return to reception to sign in and receive a visitor badge, or offer to escort them personally",
            "Follow them at a distance to observe their behaviour before deciding whether to report anything"
          ],
          correct: 2,
          points: 25,

          wrongConsequence: {
            type: "breach",
            title: "PHYSICAL BREACH",
            subtitle: "Tailgating — Unauthorised Access",
            description: "The intruder gained unchallenged access to your secure floor. Physical access led to digital compromise.",
            impacts: [
              "Unattended workstation accessed — credentials harvested via keylogger",
              "Confidential documents photographed in meeting rooms",
              "USB hardware keylogger planted behind reception computer",
              "Server room located — network access point discovered",
              "Incident logged as Critical in the post-breach investigation"
            ]
          },
          correctConsequence: {
            type: "prevented",
            title: "INTRUSION BLOCKED",
            subtitle: "Physical Security Maintained",
            description: "Excellent! You enforced access control policy. The visitor was escorted to reception where they couldn't provide valid credentials.",
            prevented: [
              "Unauthorised physical access to secure floor blocked",
              "Confidential documents and assets remain protected",
              "IT assets secured — no hardware tampering possible",
              "Incident reported to security team for investigation"
            ]
          },

          explanation: "Physical security IS cybersecurity. Tailgating completely bypasses electronic access controls costing thousands of pounds. Attackers deliberately dress professionally to exploit social politeness — this technique is called 'pretexting'. Anyone accessing a secured area must badge in. A genuine employee will not mind being asked; only an attacker will resist or pressure you.",
          tip: "You are never being rude by enforcing access policy. A genuine employee will understand. Report all tailgating attempts to your security team immediately.",

          compliance: {
            iso27001: [
              { control: "A.11.1.2", title: "Physical Entry Controls" },
              { control: "A.7.2.2",  title: "Information Security Awareness & Training" }
            ],
            nca_ecc: [
              { control: "ECC-2-5-1", title: "Physical Security Controls" }
            ],
            sama: [
              { control: "3.3.5", title: "Security Awareness & Training Program" }
            ]
          }
        },

        {
          id: "q3_3",
          type: "scenario",
          hint: "USB drives can execute code automatically the moment they are plugged in — before any antivirus can respond.",

          scenario: `SCENARIO: USB Drop Attack

Walking through the company car park, you spot a USB drive on the ground near the entrance. It has a neatly printed label:

"📂 Q4 2025 — SALARY & BONUS DATA — HR CONFIDENTIAL"

Three of your colleagues have already stopped to look at it. One says: "I'll just plug it into a spare PC quickly to check what's on it."`,

          question: "What should be done with this USB drive?",
          options: [
            "Plug it into a spare or isolated PC — if it's malicious, the damage will be limited",
            "Take it home and check the contents on a personal computer that isn't connected to the network",
            "Hand it to IT Security or management without plugging it in anywhere — they have forensic tools",
            "Discard it in the bin so nobody finds it and reduces the risk"
          ],
          hardOptions: [
            "Plug it into an air-gapped virtual machine — the sandbox will prevent any malware from spreading",
            "Check the drive's properties without opening any files — metadata won't execute malware",
            "Hand it to IT Security or management without plugging it in anywhere — they have forensic tools",
            "Put it in a sealed bag with a label and lock it in a secure cabinet until you can verify it safely"
          ],
          correct: 2,
          points: 30,

          wrongConsequence: {
            type: "infection",
            title: "MALWARE DEPLOYED",
            subtitle: "USB Drop Attack — Autorun Payload",
            description: "The drive contained an autorun payload that executed before any antivirus could intercept it. The network is now compromised.",
            impacts: [
              "Autorun malware executed within 0.3 seconds of USB connection",
              "Reverse shell established to attacker's C2 server",
              "Network credentials harvested using Mimikatz-equivalent tool",
              "Lateral movement detected across 14 network hosts within 2 hours",
              "Ransomware deployed across shared drives — company-wide incident declared"
            ]
          },
          correctConsequence: {
            type: "prevented",
            title: "ATTACK NEUTRALISED",
            subtitle: "USB Drop Attack Thwarted",
            description: "Correct! IT Security analysed the drive in a forensic sandbox. It contained a sophisticated autorun backdoor.",
            prevented: [
              "Autorun backdoor neutralised before deployment",
              "Network remains uncompromised",
              "Drive traced to active threat actor campaign — CERT notified",
              "USB port policy reviewed and hardware controls strengthened"
            ]
          },

          explanation: "USB drop attacks are a documented, widely-used technique. The label exploits natural human curiosity — salary data is irresistibly tempting. Modern autorun malware executes before Windows Autoplay dialog appears and before antivirus scans complete. No sandbox, VM, or 'safe' machine is reliably safe for unknown USB media. IT Security have forensic write-blockers that allow safe analysis.",
          tip: "Treat found USB drives like found syringes — do not touch directly and hand to IT immediately. Never plug in unknown media regardless of environment.",

          compliance: {
            iso27001: [
              { control: "A.11.1.2", title: "Physical Entry Controls" },
              { control: "A.12.2.1", title: "Controls Against Malware" }
            ],
            nca_ecc: [
              { control: "ECC-2-5-1", title: "Physical Security Controls" },
              { control: "ECC-2-3-3", title: "Endpoint Security" }
            ],
            sama: [
              { control: "3.3.5", title: "Security Awareness & Training Program" }
            ]
          }
        }
      ]
    },

    /* ================================================================
       LEVEL 4 — Safe Browsing & Fake Website Detection
    ================================================================ */
    {
      id: 4,
      title: "Safe Browsing & Fake Websites",
      description: "Identify typosquatting, scareware, and fraudulent online stores using real-world indicators.",
      icon: "🌐",
      color: "#f59e0b",
      badge: { name: "Web Sentinel", icon: "🌐", description: "Expert at detecting malicious websites and web threats" },

      questions: [
        {
          id: "q4_1",
          type: "browser",
          hint: "HTTPS and padlock icons confirm encryption only — not that the website is legitimate. Read the exact domain character by character.",

          browserUI: {
            url: "https://www.paypa1.com/login/secure",
            ssl: true,
            favicon: "💳",
            title: "PayPal — Log in to your account",
            suspiciousSegment: "paypa1",
            safeSegment: "paypal",
            pageContent: "Realistic PayPal login form (pixel-perfect clone)"
          },

          scenario: `BROWSER SIMULATION — Suspicious Login Page

You searched for PayPal and clicked the top result. Your browser shows:

🔒 https://www.paypa1.com/login/secure

The page is pixel-perfect — identical to the real PayPal login page. The padlock confirms HTTPS is active.`,

          question: "Should you enter your PayPal credentials on this page?",
          options: [
            "Yes — the padlock (HTTPS) confirms this is a secure, legitimate site",
            "Yes — the page looks exactly like the real PayPal interface",
            "No — the domain is 'paypa1.com' (digit '1' replacing letter 'l'), not 'paypal.com'",
            "Maybe — run a virus scan on your device first to make sure it hasn't been redirected"
          ],
          hardOptions: [
            "Yes — HTTPS with a valid certificate means the site was verified by a Certificate Authority",
            "Probably — enter only your email first, and only continue if the password page looks correct",
            "No — the domain is 'paypa1.com' (digit '1' replacing letter 'l'), not 'paypal.com'",
            "Uncertain — compare the page source code to the real PayPal site before entering anything"
          ],
          correct: 2,
          points: 25,

          wrongConsequence: {
            type: "breach",
            title: "CREDENTIALS STOLEN",
            subtitle: "Typosquatting / Phishing Site",
            description: "You entered your PayPal credentials on a clone site. The attacker captured them in real time via a phishing proxy.",
            impacts: [
              "PayPal username and password captured in plaintext",
              "Account balance of $1,840 transferred to attacker's account",
              "Linked bank account details harvested",
              "Account locked after fraudulent activity detection — 7-day recovery process",
              "Linked accounts (Amazon, eBay) at risk through PayPal SSO"
            ]
          },
          correctConsequence: {
            type: "prevented",
            title: "PHISHING BLOCKED",
            subtitle: "Typosquatting Detected",
            description: "Sharp eye! You caught the typosquatted domain. PayPal credentials remain secure.",
            prevented: [
              "Credential capture on fake site prevented",
              "PayPal account and linked bank remain secure",
              "Domain reported to PayPal abuse team for takedown",
              "Always use bookmarks for banking and payment sites going forward"
            ]
          },

          explanation: "Typosquatting: 'paypa1.com' substitutes the letter 'l' with digit '1'. The HTTPS padlock only confirms the connection is encrypted — it does NOT verify the site's identity. Anyone can purchase a domain and get a free SSL certificate. Attackers use this to create convincing clone sites. Always type banking and payment URLs directly or use saved bookmarks.",
          tip: "Set bookmarks for all banking and payment sites. Never use search engines to navigate to financial sites — sponsored results can be fraudulent.",

          compliance: {
            iso27001: [
              { control: "A.12.6.1", title: "Management of Technical Vulnerabilities" },
              { control: "A.7.2.2",  title: "Information Security Awareness & Training" }
            ],
            nca_ecc: [
              { control: "ECC-1-4-3", title: "Cybersecurity Awareness & Training" }
            ],
            sama: [
              { control: "3.3.5", title: "Security Awareness & Training Program" }
            ]
          }
        },

        {
          id: "q4_2",
          type: "scenario",
          hint: "Websites have no technical ability to scan your computer or detect viruses. Real security warnings come from your OS or installed antivirus software.",

          scenario: `SCENARIO: Scareware Browser Pop-Up

While reading a news article, a full-screen pop-up overlays your browser with flashing red text and an alarm sound:

┌─────────────────────────────────────────────────┐
│ ⚠️  MICROSOFT SECURITY ALERT                     │
│                                                  │
│  YOUR COMPUTER HAS BEEN INFECTED WITH           │
│  3 CRITICAL VIRUSES — YOUR DATA IS              │
│  BEING STOLEN RIGHT NOW!                        │
│                                                  │
│  Call Microsoft Support: +1-800-555-0199        │
│  [ SCAN NOW ] [ REMOVE VIRUSES ]                │
└─────────────────────────────────────────────────┘

The browser tab shows it came from: security-alert-protection.xyz`,

          question: "What is the correct response to this alert?",
          options: [
            "Click 'Scan Now' — this could be a real Windows Defender alert embedded in the browser",
            "Close this browser tab immediately, ignore the pop-up, and run your actual installed antivirus if concerned",
            "Call the phone number shown — Microsoft's support team can remotely verify if it's real",
            "Download the recommended virus removal tool and follow the on-screen instructions"
          ],
          hardOptions: [
            "Click 'Scan Now' — modern browsers can interface with Windows Defender to trigger scans",
            "Close this browser tab immediately, ignore the pop-up, and run your actual installed antivirus if concerned",
            "Call the number but don't give remote access — just ask them to confirm what they detected",
            "Screenshot the alert and search for the exact error code online to verify its legitimacy"
          ],
          correct: 1,
          points: 20,

          wrongConsequence: {
            type: "infection",
            title: "SCAREWARE INSTALLED",
            subtitle: "Fake Security Alert — Malware Download",
            description: "You clicked 'Scan Now'. The download was a fake antivirus (FakeAV) that installed a backdoor and demanded $299 to 'remove viruses'.",
            impacts: [
              "FakeAV malware installed — displays fabricated virus count",
              "$299 'premium removal' payment collected via fake checkout",
              "Backdoor persists after payment — attacker retains access",
              "Keylogger logs all keyboard input including banking credentials",
              "Device enrolled in botnet for spam and DDoS campaigns"
            ]
          },
          correctConsequence: {
            type: "prevented",
            title: "SCAREWARE BLOCKED",
            subtitle: "Fake Alert Correctly Identified",
            description: "Correct! Websites cannot scan your computer. Closing the tab was exactly right.",
            prevented: [
              "FakeAV malware installation prevented",
              "Fraudulent payment avoided",
              "No backdoor or keylogger installed",
              "Browser cache cleared — site blocked in browser settings"
            ]
          },

          explanation: "Scareware: websites have zero technical ability to scan your computer or detect viruses. This pop-up is pure psychological manipulation using fear. The phone number connects to tech support scammers. 'Microsoft Security Alerts' never appear in browser pop-ups — they come from Windows Action Centre or Defender itself. Close the tab; do not call the number, click links, or download anything.",
          tip: "Real security warnings come from your installed OS security software (Windows Defender, etc.) — never from a website. If in doubt, press Alt+F4 or use Task Manager to close the browser.",

          compliance: {
            iso27001: [
              { control: "A.12.2.1", title: "Controls Against Malware" },
              { control: "A.7.2.2",  title: "Information Security Awareness & Training" }
            ],
            nca_ecc: [
              { control: "ECC-2-3-3", title: "Endpoint Security" }
            ],
            sama: [
              { control: "3.3.5", title: "Security Awareness & Training Program" }
            ]
          }
        },

        {
          id: "q4_3",
          type: "scenario",
          hint: "An 80% discount on electronics combined with irreversible payment methods and a newly-registered domain is a scam with near-certainty.",

          scenario: `SCENARIO: Fraudulent Online Store Assessment

You find an online store advertising the latest iPhone 16 Pro Max for $199 (retail: $1,199). The site looks professional — polished product photos, a clean layout, and customer 'reviews'.

On closer inspection you note:
• No physical address, phone number, or live chat — only a Gmail contact form
• Accepts only wire transfer or cryptocurrency (no credit/debit cards)
• Domain registered 9 days ago (verified via WHOIS lookup)
• No social media presence older than 2 weeks
• 'Reviews' use stock photos as profile pictures`,

          question: "How do you assess this online store?",
          options: [
            "Likely legitimate — extreme discounts exist online and the site looks professional",
            "Worth a small test order — if the product doesn't arrive, the loss is manageable",
            "Almost certainly a scam — multiple converging high-risk indicators confirm fraud intent",
            "Safe to buy from — the professional design means they invested in the site legitimately"
          ],
          hardOptions: [
            "Risky but possible — submit a dispute with your bank after ordering as a safety net",
            "Investigate further — search for the store name plus 'reviews' or 'scam' before ordering",
            "Almost certainly a scam — multiple converging high-risk indicators confirm fraud intent",
            "Proceed with a small amount via PayPal — buyer protection would cover fraud losses"
          ],
          correct: 2,
          points: 20,

          wrongConsequence: {
            type: "scam",
            title: "FINANCIAL FRAUD",
            subtitle: "Fake Online Store — No Goods Delivered",
            description: "You completed the wire transfer. The store disappeared 48 hours later and the domain was abandoned.",
            impacts: [
              "Wire transfer of $199 sent — irrecoverable (no chargeback on wire transfers)",
              "Personal name, address, and email harvested for identity fraud",
              "Domain abandoned 48 hours after receiving payment",
              "Same operation had 340 other victims in that month",
              "Reported to Action Fraud — low recovery probability for wire transfers"
            ]
          },
          correctConsequence: {
            type: "prevented",
            title: "FRAUD AVOIDED",
            subtitle: "Fake Store Correctly Identified",
            description: "Excellent assessment! You recognised the converging fraud indicators and avoided the scam.",
            prevented: [
              "Fraudulent wire transfer avoided — $199 saved",
              "Personal data not submitted to fraudulent operator",
              "Store reported to Action Fraud and domain registrar",
              "Awareness shared to protect other potential victims"
            ]
          },

          explanation: "Five converging fraud signals: (1) 83% discount is economically impossible for legitimate retail. (2) Wire transfers and cryptocurrency are irreversible — no chargeback protection. (3) 9-day-old domain means no legitimate business history. (4) No verifiable contact information. (5) Stock-photo 'reviews'. Scammers invest in professional designs to appear credible. Always check domain age and pay with credit cards.",
          tip: "Use whois.domaintools.com to check domain age. Only buy from sites accepting credit cards (chargeback protection). Check reviews on Trustpilot or Google before any purchase.",

          compliance: {
            iso27001: [
              { control: "A.7.2.2", title: "Information Security Awareness & Training" }
            ],
            nca_ecc: [
              { control: "ECC-1-4-3", title: "Cybersecurity Awareness & Training" }
            ],
            sama: [
              { control: "3.3.5", title: "Security Awareness & Training Program" }
            ]
          }
        }
      ]
    },

    /* ================================================================
       LEVEL 5 — Malware & Incident Response
    ================================================================ */
    {
      id: 5,
      title: "Malware & Incident Response",
      description: "Identify malicious attachments, ransomware attacks, and respond correctly to active incidents.",
      icon: "🦠",
      color: "#ef4444",
      badge: { name: "Threat Hunter", icon: "☠️", description: "Expert malware awareness and incident response knowledge" },

      questions: [
        {
          id: "q5_1",
          type: "email",
          hint: "Look very carefully at the file extension. Windows hides known extensions by default — this file has TWO extensions.",

          emailUI: {
            client: "Outlook",
            from: { displayName: "Ahmed Al-Rashidi", address: "ahmed.alrashidi@yourcompany.com" },
            to: "you@yourcompany.com",
            subject: "Re: Invoice you requested",
            date: "Tue, Mar 17, 2026, 3:41 PM",
            priority: "normal",
            body: [
              { type: "p", text: "Hey," },
              { type: "p", text: "Here's that invoice you asked about. Let me know if you need anything else." },
              { type: "p", text: "Cheers" }
            ],
            attachments: [
              { name: "Invoice_2024_URGENT.pdf.exe", size: "246 KB", icon: "📎", suspicious: true }
            ],
            redFlags: [
              { icon: "🔴", category: "Double Extension",     text: "'Invoice_2024_URGENT.pdf.exe' is a Windows executable (.exe) disguised as a PDF. Windows hides .exe by default — showing only '.pdf' to users." },
              { icon: "🔴", category: "Unexpected Attachment", text: "You don't recall requesting any invoice — unexpected attachments from 'known' contacts indicate Business Email Compromise (BEC)." },
              { icon: "🟠", category: "Vague Context",        text: "Extremely brief message with no project, client, or reference number — legitimate invoices include full business context." },
              { icon: "🟡", category: "Account Compromise",   text: "Ahmed's email account may be compromised and used to distribute malware to trusted contacts." }
            ]
          },

          question: "What should you do with this email and attachment?",
          options: [
            "Open the attachment — Ahmed is a trusted colleague, so it must be safe",
            "Open it — your antivirus software will intercept any malicious content before it can execute",
            "Do NOT open the attachment — verify with Ahmed via a separate channel (phone/Teams) and report to IT",
            "Rename the file extension from .exe to .pdf, then open it safely"
          ],
          hardOptions: [
            "Open it in a sandboxed viewer like Google Drive to isolate any potential risk",
            "Check with Ahmed by replying to the email first to confirm he sent it before opening",
            "Do NOT open the attachment — verify with Ahmed via a separate channel (phone/Teams) and report to IT",
            "Forward it to IT Security first and ask them to scan it before you open your copy"
          ],
          correct: 2,
          points: 25,

          wrongConsequence: {
            type: "infection",
            title: "MALWARE EXECUTED",
            subtitle: "Double-Extension Trojan — BEC Attack",
            description: "The .exe payload executed immediately. Ahmed's account was compromised weeks ago and used to target colleagues.",
            impacts: [
              "Trojan executed in 0.2 seconds — spawned 4 child processes",
              "Keylogger and credential harvester deployed instantly",
              "Corporate email credentials exfiltrated to C2 server",
              "Lateral movement across 8 hosts over 36 hours",
              "Full ransomware deployment — company-wide incident declared"
            ]
          },
          correctConsequence: {
            type: "prevented",
            title: "MALWARE BLOCKED",
            subtitle: "Double-Extension Attack Stopped",
            description: "Correct decision. IT confirmed Ahmed's account was compromised as part of a BEC campaign. The attachment was a Trojan.",
            prevented: [
              "Trojan execution prevented — attachment quarantined",
              "Ahmed's account secured and password reset",
              "BEC campaign identified — all staff warned",
              "Network lateral movement attack chain broken"
            ]
          },

          explanation: "Double-extension attack: '.pdf.exe' is a Windows executable. Windows hides known extensions by default, showing only 'Invoice_2024_URGENT.pdf'. Ahmed's account was compromised (BEC) and used to distribute malware to trusted contacts who wouldn't question a file from a colleague. Always verify unexpected attachments through a SEPARATE communication channel — not by replying to the suspicious email.",
          tip: "Enable 'Show file name extensions' in Windows Explorer (View > Show > File name extensions). An unexpected attachment from ANY known contact is a major red flag.",

          compliance: {
            iso27001: [
              { control: "A.12.2.1", title: "Controls Against Malware" },
              { control: "A.13.2.3", title: "Electronic Messaging Security" }
            ],
            nca_ecc: [
              { control: "ECC-2-3-3", title: "Endpoint Security" },
              { control: "ECC-2-3-1", title: "Electronic Mail Security" }
            ],
            sama: [
              { control: "3.3.6", title: "Endpoint Security Management" },
              { control: "3.3.5", title: "Security Awareness & Training Program" }
            ]
          }
        },

        {
          id: "q5_2",
          type: "ransomware",
          hint: "Network isolation stops the ransomware spreading. Do NOT pay — it funds criminals and recovery is not guaranteed.",

          ransomwareUI: {
            title: "⚠️  YOUR FILES HAVE BEEN ENCRYPTED  ⚠️",
            wallet: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            amount: "3 Bitcoin  (≈ $190,000)",
            countdown: "71:58:43",
            body: [
              "All your documents, databases, photos, and backups have been encrypted with AES-256 + RSA-4096 military-grade encryption.",
              "To recover your files, transfer the ransom to the Bitcoin wallet below. Your unique decryption key will be emailed within 24 hours of confirmed payment.",
              "• Every 24 hours of delay: the ransom amount doubles.",
              "• After 7 days: your decryption key is permanently deleted — recovery impossible.",
              "Do NOT: restart the computer, contact law enforcement, or attempt decryption tools — doing so will trigger immediate key deletion."
            ],
            encryptedFiles: [
              { name: "Q1_Financial_Report_2026.xlsx.locked",  icon: "📊" },
              { name: "Client_CRM_Database.accdb.locked",       icon: "🗄️" },
              { name: "HR_Personnel_Records.docx.locked",       icon: "📄" },
              { name: "Strategic_Roadmap_2026.pptx.locked",     icon: "📎" },
              { name: "Backup_Archive_2026.zip.locked",         icon: "🗜️" }
            ]
          },

          scenario: `INCIDENT SIMULATION — Active Ransomware Attack

You arrive at work and your screen displays the message above. All files on your computer and mapped network drives show the '.locked' extension. The countdown is running.`,

          question: "You are hit with ransomware. What is the FIRST correct action?",
          options: [
            "Pay the ransom immediately — time-critical and your company needs those files",
            "Restart the computer — this may interrupt the encryption process before it completes",
            "Immediately disconnect from the network (unplug cable / disable Wi-Fi), then notify IT Security",
            "Search online for free ransomware decryption tools and attempt self-recovery first"
          ],
          hardOptions: [
            "Pay the ransom — contact the attacker's support chat to negotiate a reduced amount first",
            "Restart into Safe Mode — this prevents the ransomware from running while you investigate",
            "Immediately disconnect from the network (unplug cable / disable Wi-Fi), then notify IT Security",
            "Run a full antivirus scan to remove the ransomware before it can encrypt more files"
          ],
          correct: 2,
          points: 30,

          wrongConsequence: {
            type: "breach",
            title: "RANSOMWARE SPREADS",
            subtitle: "Network Not Isolated — Cascade Infection",
            description: "Without network isolation, the ransomware propagated across the company network before IT could respond.",
            impacts: [
              "Ransomware spread to 47 networked workstations in 90 minutes",
              "File servers encrypted — 4.2TB of company data locked",
              "Backups connected to network also encrypted",
              "Company operations halted for 11 days",
              "Total recovery cost: $2.3M (ransom + recovery + regulatory fines)"
            ]
          },
          correctConsequence: {
            type: "prevented",
            title: "SPREAD CONTAINED",
            subtitle: "Ransomware Isolated Successfully",
            description: "Rapid network isolation contained the ransomware to one machine. IT restored from offline backups within 4 hours.",
            prevented: [
              "Ransomware contained to single workstation — network unaffected",
              "Offline backups intact — full restore in 4 hours",
              "Ransom not paid — no funds to criminals",
              "Forensic investigation launched — attack vector identified and patched"
            ]
          },

          explanation: "Ransomware containment protocol: (1) IMMEDIATELY disconnect from network — unplug ethernet, disable Wi-Fi. This stops spreading to shared drives and other machines. (2) Do NOT pay — funds criminals with no guarantee of key delivery (40% of payers never receive working keys). (3) Do NOT restart — may trigger additional payloads. (4) Call IT immediately. Offline backups following the 3-2-1 rule are the best recovery path.",
          tip: "Follow the 3-2-1 backup rule: 3 copies, 2 different media types, 1 offsite/offline. Test restores quarterly. Offline backups are immune to ransomware.",

          compliance: {
            iso27001: [
              { control: "A.12.2.1", title: "Controls Against Malware" },
              { control: "A.16.1.1", title: "Responsibilities and Procedures — Incident Management" },
              { control: "A.12.3.1", title: "Information Backup" }
            ],
            nca_ecc: [
              { control: "ECC-2-3-3", title: "Endpoint Security" },
              { control: "ECC-2-9-1", title: "Backup & Recovery Management" }
            ],
            sama: [
              { control: "3.3.6", title: "Endpoint Security Management" },
              { control: "4.2.3", title: "Cybersecurity Incident Management" }
            ]
          }
        },

        {
          id: "q5_3",
          type: "scenario",
          hint: "Multiple simultaneous system behaviour changes after installing software are a strong indicator of bundled malware.",

          scenario: `SCENARIO: Adware / PUP Installation

You downloaded a free 'VideoMaster Pro Converter' utility from a third-party download site. The software works as advertised, but after installation you notice:

• Browser's default search engine changed to 'Search-Pro.xyz'
• Advertisements now appear on every website including banking sites
• Three new browser extensions appeared you did not install
• PC performance has degraded noticeably — CPU runs at 40% at idle
• A new startup entry 'SystemSpeedHelper' was added to Task Manager`,

          question: "What most likely happened during the installation?",
          options: [
            "Normal behaviour — free software tools always have minor performance and browser side effects",
            "A Windows background update changed browser defaults and installed new extensions automatically",
            "The software bundled adware and Potentially Unwanted Programs (PUPs) that were installed silently",
            "Your computer has a hardware fault causing the performance drop and display anomalies"
          ],
          hardOptions: [
            "Normal — the download site pre-configures software to use partner search engines as their revenue model",
            "Likely a browser hijack virus unrelated to the software — run Windows Defender to isolate the cause",
            "The software bundled adware and Potentially Unwanted Programs (PUPs) that were installed silently",
            "The software conflicts with your existing antivirus — disable Defender temporarily and reinstall"
          ],
          correct: 2,
          points: 20,

          wrongConsequence: {
            type: "infection",
            title: "ADWARE ENTRENCHED",
            subtitle: "PUP Infection — Persistent Browser Hijack",
            description: "By accepting the behaviour as normal, the adware deepened its persistence mechanisms and began harvesting browsing data.",
            impacts: [
              "All browsing history and searches transmitted to data brokers",
              "Banking site ads replaced with credential-phishing overlays",
              "Search-Pro.xyz tracking cookie persists across browser clears",
              "SystemSpeedHelper backdoor provides remote access capability",
              "PC performance degradation worsened — additional PUPs downloaded"
            ]
          },
          correctConsequence: {
            type: "prevented",
            title: "PUP REMOVED",
            subtitle: "Adware Infection Cleaned",
            description: "You correctly identified the PUP infection, ran Malwarebytes, removed all bundled software, and uninstalled the original utility.",
            prevented: [
              "Browsing data and credentials protected",
              "Persistent backdoor mechanism removed",
              "Browser settings fully restored",
              "System performance returned to baseline"
            ]
          },

          explanation: "Classic PUP (Potentially Unwanted Program) bundle attack. Free software from third-party download sites frequently includes opt-in (pre-checked) or silent installs of adware, browser hijackers, and backdoors. These are pre-checked during installation — often displayed in confusing EULA text. Always download from the official developer's website and choose Custom/Advanced installation to review every step.",
          tip: "Use Malwarebytes (free) to scan for PUPs. Always download software from the official developer site. Choose 'Custom Install' and uncheck all pre-selected bundled extras.",

          compliance: {
            iso27001: [
              { control: "A.12.2.1", title: "Controls Against Malware" },
              { control: "A.12.5.1", title: "Installation of Software on Operational Systems" }
            ],
            nca_ecc: [
              { control: "ECC-2-3-3", title: "Endpoint Security" }
            ],
            sama: [
              { control: "3.3.6", title: "Endpoint Security Management" }
            ]
          }
        }
      ]
    }

  ], // end levels

  /* ================================================================
     IMPROVEMENT TIPS — Shown on game end screen
  ================================================================ */
  tips: [
    "Use a password manager (Bitwarden — free, 1Password — premium) to generate a unique random password for every account",
    "Enable multi-factor authentication on all critical accounts: email, banking, and corporate systems first",
    "Keep your OS, browsers, and applications fully updated — most breaches exploit known, patched vulnerabilities",
    "Hover over links before clicking to inspect the real destination URL in the browser's status bar",
    "Follow the 3-2-1 backup rule: 3 copies, 2 media types, 1 offsite/offline backup — test restores quarterly",
    "Never plug in USB drives you find in public spaces — USB drop attacks are a documented, active threat technique",
    "Urgency + authority + threat = social engineering. Slow down, verify independently, then act",
    "HTTPS padlock and professional design do NOT confirm a site is legitimate — always verify the exact domain",
    "Report suspicious emails, calls, and incidents to your IT/security team immediately — you are the first line of defence",
    "Physical security is cybersecurity — challenge all tailgaters and report unescorted visitors every time"
  ]

}; // end GAME_DATA
