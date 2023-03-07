---
title: "Password validation and 2FA"
path: "/blog/2023-03-password-validation-2fa"
date: "2023-03-03T17:03:00"
author: lrietveldminajanicijevic
---

# How TriplyDB is Leading the Way in Password Security?

In the latest TriplyDB release, we encourage people to write good passwords. But what constitutes a good password, and how do we encourage people to write such passwords?

The [National Institute of Standards and Technology (NIST)](https://www.nist.gov) is a U.S. government science laboratory, and considered an authority in the area of Information Security. ISO standards such as ISO 27001 often take inspiration from NIST guidelines.
NIST published a guideline for digital identity management[^1] that covers the topic of password composition and validation.  

In this blog we'll discuss what this guideline means in practice, and how this is implemented in TriplyDB

## What does a good password look like?{#best}

A strong password should be challenging to crack, whether it's by an automated program or a person using techniques such as [social engineering](https://en.wikipedia.org/wiki/Social_engineering_(security)).

The NIST guideline and corresponding literature[^2][^3] provide several suggestions:

1. The larger the password, the higher the entropy, making it difficult to guess the password. A password like `uTxyyDGXxnYsbWy4g6Ma` is preferable over `1Jix5bQi`.
2. The more diverse characters used, the [better](https://pages.nist.gov/800-63-3/sp800-63b.html#a3-complexity). That means we don't have to stick to letters, numbers and punctuation marks, but we can even include smileys (😀) or other unicode characters (❤⛔👀).
3. A good password should not be leaked: There are corpuses available (such as [have i been pwned?](https://haveibeenpwned.com)) that includes leaked passwords gathered from data breaches of popular websites. As some people tend to re-use passwords between websites, such corpuses may leave them vulnerable to attack. If john@doe.com reuses the same password for many websites, and one of this website has been breached, then all others accounts of John Doe will be vulnerable.
4. Avoid using dictionary words, particularly for shorter passwords. Having dictionary words only would leave you vulnerable to a brute-force attach where an automated script repeatedly tries to enter a password using commonly-used words.
5. The password should not include repetitive or sequential characters. Examples are `aaaaaa`, `12345`, or even `asdfg` (letters close to each other on your keyboard). Such passwords are too easy to guess
6. Context-specific words should not be allowed as they are too easy to guess. Examples are using the word `TriplyDB` or your username in the password.

## Examples of bad password policies.

Implementing a password policy that satisfies the above suggestions is difficult. As a result, there are many password policies in use that we'd advocate against. Examples of such policies:

### Requiring a particular set of characters

A typical measure for encouraging stronger passwords is requiring a particular set of characters. This is called an *explicit* password policy. E.g., at minimum one uppercase letter, one lowercase letter, one digit and one symbol. As shown in research related to password testing metrics[^4], users tend to go for predictable passwords when such policies are enforced. If a user would have wanted to use a password `password`, she'd by relatively likely choose a password like `Password1!` as an alternative to satisfy the criteria.

### Rotating passwords

Some organization force users to rotate their password every several months. The intent of such password rotation mechanism is to avoid the threat that a password is compromised by a leak on other websites (given that some passwords may be re-used across websites).
That means that the longer a password is in use and not renewed, the larger the chance of the password being exposed. 

The problem with such password rotation policies is that users tend to choose a weaker password when they know they'll have to change it in the near future. For instance, users with the password `Password1!` may simply append the date they created the password and end up with `Password1~June22`

In addition to that, such password rotation policies have a great impact on usability. As a result users may get frustrated with such policies only to invent insecure workaround to cater to such policies.

## How Triply encourage good passwords TriplyDB

In general, a good password policy strikes a balance between maximizing security and usability. 
We implemented a password validator for TriplyDB that estimates the strength of a password and communicates this via a strength meter. When a password is not good enough, suggestions are given to the user on how to improve the password.

![TriplyDB Password Validator](password.png)

The TriplyDB password validator satisfies all of the NIST guidelines for password best practices, as listed in the [What does a good password look like?](#best) section above. Specifically:

1. Large passwords are encouraged. 
2. Any character is valid, not just numbers, letters and symbols.
3. The validator takes words from the dictionary into account. Using dictionary words will negatively impact the password score. Variants of dictionary words are also included, i.e. `P@ssword` will be recognized as the word `Password`.
4. Repetition of characters negatively influence the password score. This includes `aaaa`, `12345` and repetition using your keyboard layout such as `asdfg`
5. Context specific words will also negatively influence the password score.

## Additional TriplyDB security features

### Automatic notifications when we detect a login from a new IP.

This feature sends an automatic notification to the user whenever there is a login attempt detected from a new IP address. This can help alert the user to potential unauthorized access attempts, and allow them to take action to secure their account. By monitoring the IPs that have logged into the account, this feature can help detect any unusual activity and provide an extra layer of security to the account.

### Two-Factor Authentication (2FA)

Two-factor authentication (2FA) is a security process in which a user provides two different authentication factors to verify their identity. TriplyDB now offers 2FA as an option for users who want to add an extra layer of security to their accounts. When 2FA is enabled, users must provide two types of identification to access their accounts:

- Their current password.
- A time-based one-time password (TOTP).

Here's how 2FA works with TriplyDB:

- When a user enables 2FA, they will be taken through the 2FA setup process.
- The user will be shown a QR code that can be scanned using an Authenticator App (eg. google, microsoft, others)
- The Authenticator App provides the user with a TOTP as their 2nd factor for authentication.
- The user will also be given a set of security codes for safe storage.

When logging in using 2FA:

- When they log in to TriplyDB, they will need to enter their password as usual.
- They will then have to use their Authenticator App to obtain their TOTP code. 
- If the code is correct, they will be granted access to their account.

If a user is locked out of their account:

- During the login process they can use their password and one of their security codes to recover their account.
- If none of these steps work, they can contact Triply support. wanted access to their account.

The idea behind 2FA is that even if a hacker manages to obtain a user's password, they still cannot access the account without the second factor. This provides an additional layer of security and helps to prevent unauthorized access to sensitive information.

## What's on the horizon 

A good password policy is an important part of securing TriplyDB and its accounts. That being said, there are other large improvements coming to make TriplyDB even more secure such as:

- Validating entered passwords against previous breaches


[^1]: NIST Special Publication 800-63B, Digital Identity Guidelines, June 2017, updated February 2020, available at: [https://pages.nist.gov/800-63-3/sp800-63b.html](https://pages.nist.gov/800-63-3/sp800-63b.html).
[^2]: Komanduri, Saranga, Richard Shay, Patrick Gage Kelley, Michelle L Mazurek, Lujo Bauer, Nicolas Christin, Lorrie Faith Cranor, and Serge Egelman. "Of Passwords and People: Measuring the Effect of Password-Composition Policies." In Proceedings of the SIGCHI Conference on Human Factors in Computing Systems, 2595–2604. ACM, 2011. Available at: [https://www.ece.cmu.edu/~lbauer/papers/2011/chi2011-passwords.pdf](https://www.ece.cmu.edu/~lbauer/papers/2011/chi2011-passwords.pdf
[^3]: de Carné de Carnavalet, Xavier and Mohammad Mannan. "From Very Weak to Very Strong: Analyzing Password-Strength Meters." In Proceedings of the Network and Distributed System Security Symposium (NDSS), 2014. Available at: [http://www.internetsociety.org/sites/default/files/06_3_1.pdf](http://www.internetsociety.org/sites/default/files/06_3_1.pdf)
[^4]: Weir, Matt, Sudhir Aggarwal, Michael Collins, and Henry Stern. "Testing Metrics for Password Creation Policies by Attacking Large Sets of Revealed Passwords." In Proceedings of the 17th ACM Conference on Computer and Communications Security, 162–175. CCS '10. New York, NY, USA: ACM, 2010. doi:10.1145/1866307.1866327.