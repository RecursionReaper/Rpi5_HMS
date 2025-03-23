import yagmail

def send_email():
    sender_email = "rasphss@gmail.com"
    receiver_email = "aniketdesai2005@gmail.com"
    subject = "Amazon package has been delivered!"
    body = "Hi Master Aniket, an human has been detected."
    app_password = "bxqu ydcp sted yihm"  # Replace this with your real app password
    

    # Initialize yagmail client
    yag = yagmail.SMTP(sender_email, app_password)

    # Send the email with attachment
    yag.send(
        to=receiver_email,
        subject=subject,
        contents=body,
    )
    print("Email sent successfully with attachment!")

if __name__ == "__main__":
    send_email()
