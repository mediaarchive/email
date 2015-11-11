import base64
import email

def subject_decode(subject):
    subject = subject.decode().replace('Subject: ', '').replace('=?utf-8?b?', '').replace('=?UTF-8?B?', '').replace('?=', '').replace("\r\n", '')
    arr = subject.split(' ')
    subject_str = ''
    
    for val in arr:
        subject_str += base64.b64decode(val).decode('utf-8')
        
    return subject_str

def content_parse(content):
    print(content)
    print(email.message_from_string(content))