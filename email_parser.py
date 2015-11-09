import base64

def subject_decode(subject):
    subject = subject.replace('Subject: ', '').replace('=?utf-8?b?', '').replace('?=', '').replace("\r\n", '')
    arr = subject.split(' ')
    subject_str = ''
    
    for val in arr:
        subject_str += base64.b64decode(val).decode('utf-8')
        
    return subject_str
