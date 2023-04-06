from Crypto.Cipher import AES
import base64
import json


BLOCK_SIZE = 16  # Bytes


def pad(s):
    return s + (BLOCK_SIZE - len(s) % BLOCK_SIZE) * \
        chr(BLOCK_SIZE - len(s) % BLOCK_SIZE)


def unpad(s):
    return s[:-ord(s[len(s) - 1:])]


def aesEncrypt(key, data):  # 加密
    '''
    AES的ECB模式加密方法
    :param key: 密钥
    :param data:被加密字符串（明文）
    :return:密文
    '''
    key = key.encode('utf8')
    # 字符串补位
    data = pad(data)
    cipher = AES.new(key, AES.MODE_ECB)
    # 加密后得到的是bytes类型的数据，使用Base64进行编码,返回byte字符串
    result = cipher.encrypt(data.encode())
    encodestrs = base64.b64encode(result)
    enctext = encodestrs.decode('utf8')
    ret = enctext.replace('/', '#')
    return ret


def aesDecrypt(key, data):  # 解密
    '''
    :param key: 密钥
    :param data: 加密后的数据（密文）
    :return:明文
    '''
    key = key.encode('utf8')
    data = base64.b64decode(data)
    cipher = AES.new(key, AES.MODE_ECB)

    # 去补位
    text_decrypted = unpad(cipher.decrypt(data))
    ret = text_decrypted.decode('utf8')
    print(ret)
    return ret


if __name__ == '__main__':
    key = 'ja72jks98x72masx'
    data = {
        "keywords": "123",
        "currentPage": 1,
        "pageSize": 20,
        "allGroupIds": [2705]
    }
    # ecdata = aesEncrypt(
    #     key, '{"keywords":"123","currentPage":1,"pageSize":20,"allGroupIds":[2705]}'
    # )

    # m = 'bPHRxFs42t0EDLGA3+w7t4yUyNJKCI+iS91jvhb8UfbIlCjUT15#ZJehWAzil21oUoOcYW9QkwCfxw7u4NbYYH#xZLwd0Bl9yIS3NkiwPowEZN4nM#dCvnEZ0Ac5xp6s'
    # dcdata = aesDecrypt(key, m.replace('#', '/'))
    # aesDecrypt(key, ecdata)

# 参考
# https://blog.csdn.net/guohao326/article/details/104695459/
# https://blog.csdn.net/chouzhou9701/article/details/122019967
# https://blog.csdn.net/Herishwater/article/details/92131547
