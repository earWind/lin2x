# http://api.k2.haixue.com/wechat/headwork/chanceDetailList/list
# Cookie: gr_user_id=486c33ca-2c07-4a0a-94e2-666d4db3ee1d; Hm_lvt_a2381ea68b047ac974f8d1977a0ef79e=1661671265; Hm_lvt_3801913c7c5b747b4e315c60418a9308=1661671265,1661699563; zg_did=%7B%22did%22%3A%20%22183400bfc1d204-0b3e5c0466fe51-26021a51-1fa400-183400bfc1edf0%22%7D; zg_9b985b4e163746bcb3e8ae9a6789e00d=%7B%22sid%22%3A%201663226870817%2C%22updated%22%3A%201663226870821%2C%22info%22%3A%201663226870819%2C%22superProperty%22%3A%20%22%7B%5C%22%E5%BA%94%E7%94%A8%E5%90%8D%E7%A7%B0%5C%22%3A%20%5C%22%E5%BE%AE%E4%BF%A1%E5%AD%A6%E4%B9%A0%E5%8D%A1%5C%22%7D%22%2C%22platform%22%3A%20%22%7B%7D%22%2C%22utm%22%3A%20%22%7B%7D%22%2C%22referrerDomain%22%3A%20%22%22%2C%22cuid%22%3A%20%22undefined%22%7D; afa6f4b5a41e143f_gr_last_sent_cs1=CD15714; security_refresh=8780372edff24be7bdb13d6dfb4fc73a.33923643.1677859529851.web.16dec14904359c89244fa14730ecf3cb; security_cookie_user=184562; afa6f4b5a41e143f_gr_session_id=ee79eb77-fb75-4419-9cf1-5d7dd1552e21; afa6f4b5a41e143f_gr_last_sent_sid_with_cs1=ee79eb77-fb75-4419-9cf1-5d7dd1552e21; afa6f4b5a41e143f_gr_session_id_ee79eb77-fb75-4419-9cf1-5d7dd1552e21=true; x_access_token=eU28d1NezjlFemNIntoyefqp90wW9BjkQewmpwx6t19ad6sdjlMrW6iD9+apjy3JsOCoNJKf8quo2aLWIJ6TdkkQWUTBQ9+jh4xoINzx+Fk=; COOKIE_TICKET=NjQyNmU0MzNjOTgzNjMwMDA5YjJlY2JhLjE4NDU2Mi4xNjgwMjcwMzg3NDUwLjE2ODAyOTE5ODc0NTAuUEMuMDU0ZmFmN2EyOGQzZmMzNDZmYjFiYzc1MzM1Mzk1ODQ=; ul_ticket=NjQyNmU0MzNjOTgzNjMwMDA5YjJlY2JhLjE4NDU2Mi4xNjgwMjcwMzg3NDUwLjE2ODAyOTE5ODc0NTAuUEMuMDU0ZmFmN2EyOGQzZmMzNDZmYjFiYzc1MzM1Mzk1ODQ=; webapi_session_ticket=NjQyNmU0MzNjOTgzNjMwMDA5YjJlY2JhLjE4NDU2Mi4xNjgwMjcwMzg3NDUwLjE2ODAyOTE5ODc0NTAuUEMuMDU0ZmFmN2EyOGQzZmMzNDZmYjFiYzc1MzM1Mzk1ODQ=; afa6f4b5a41e143f_gr_cs1=CD15714; webapi_session_ticket=NjQyNmU0MzNjOTgzNjMwMDA5YjJlY2JhLjE4NDU2Mi4xNjgwMjcwMzg3NDUwLjE2ODAyOTE5ODc0NTAuUEMuMDU0ZmFmN2EyOGQzZmMzNDZmYjFiYzc1MzM1Mzk1ODQ=; SESSION=NDQ1NDg1MWItMTI0NS00MjEyLThmNTktZGRmM2MwZDBiNDVh
# parmSecretData: "YZ7KM3b19LbVmD0akpBC1rMnWmLS20rkcfZQ17EY0zEUJxry853T++lw#M3MKjk8kMtK0SrkyHSqMH2cYN#hvA=="
import requests as rq
import json
import time


def get_list():
    data = {
        "parmSecretData": "YZ7KM3b19LbVmD0akpBC1rMnWmLS20rkcfZQ17EY0zEUJxry853T++lw#M3MKjk8kMtK0SrkyHSqMH2cYN#hvA=="
    }
    # https://www.bilibili.com/video/BV1CL411E7iC/?spm_id_from=333.337.search-card.all.click&vd_source=0666345275f1b3fa9bdc9028249f3b38
    Cookie = 'gr_user_id=486c33ca-2c07-4a0a-94e2-666d4db3ee1d; Hm_lvt_a2381ea68b047ac974f8d1977a0ef79e=1661671265; Hm_lvt_3801913c7c5b747b4e315c60418a9308=1661671265,1661699563; zg_did=%7B%22did%22%3A%20%22183400bfc1d204-0b3e5c0466fe51-26021a51-1fa400-183400bfc1edf0%22%7D; zg_9b985b4e163746bcb3e8ae9a6789e00d=%7B%22sid%22%3A%201663226870817%2C%22updated%22%3A%201663226870821%2C%22info%22%3A%201663226870819%2C%22superProperty%22%3A%20%22%7B%5C%22%E5%BA%94%E7%94%A8%E5%90%8D%E7%A7%B0%5C%22%3A%20%5C%22%E5%BE%AE%E4%BF%A1%E5%AD%A6%E4%B9%A0%E5%8D%A1%5C%22%7D%22%2C%22platform%22%3A%20%22%7B%7D%22%2C%22utm%22%3A%20%22%7B%7D%22%2C%22referrerDomain%22%3A%20%22%22%2C%22cuid%22%3A%20%22undefined%22%7D; afa6f4b5a41e143f_gr_last_sent_cs1=CD15714; security_refresh=8780372edff24be7bdb13d6dfb4fc73a.33923643.1677859529851.web.16dec14904359c89244fa14730ecf3cb; x_access_token=eU28d1NezjlFemNIntoyeQrakZd5fKKwbk16as0tPF5ad6sdjlMrW6iD9+apjy3JfUiZQ23FHUEPVam81YjqhOlrlCuaDcOqUyoh+aW41AY=; x-access-token=c/VgnwC8a0VPbPSSCLyPwlBq/hgmSxHc3A4+cB/KcwEV0rMRXv6Cg1c2yOstwNsR0DrBgMBzSehhqNXF0E2ffDQ69p/Eqk02q5arzZ3fnEA=; COOKIE_TICKET=NjQyN2MxMDAxMmI0MDQwMDA2NjA3YjcwLjE4NDU2Mi4xNjgwMzI2OTEyOTMzLjE2ODAzNDg1MTI5MzMuUEMuMDU3MjU3MDIyYmRkZWFkNDU4OGEwMTQxZDk5YzJlNTA=; ul_ticket=NjQyN2MxMDAxMmI0MDQwMDA2NjA3YjcwLjE4NDU2Mi4xNjgwMzI2OTEyOTMzLjE2ODAzNDg1MTI5MzMuUEMuMDU3MjU3MDIyYmRkZWFkNDU4OGEwMTQxZDk5YzJlNTA=; webapi_session_ticket=NjQyN2MxMDAxMmI0MDQwMDA2NjA3YjcwLjE4NDU2Mi4xNjgwMzI2OTEyOTMzLjE2ODAzNDg1MTI5MzMuUEMuMDU3MjU3MDIyYmRkZWFkNDU4OGEwMTQxZDk5YzJlNTA=; webapi_session_ticket=NjQyN2MxMDAxMmI0MDQwMDA2NjA3YjcwLjE4NDU2Mi4xNjgwMzI2OTEyOTMzLjE2ODAzNDg1MTI5MzMuUEMuMDU3MjU3MDIyYmRkZWFkNDU4OGEwMTQxZDk5YzJlNTA=; security_cookie_user=184562; SESSION=NjMyOTc5NzMtOGMzMC00YWZjLWIzZmEtNDAyYjYxZmQ5NWJh; afa6f4b5a41e143f_gr_session_id=09834bf4-3c67-4795-8d81-8403634f5940; afa6f4b5a41e143f_gr_last_sent_sid_with_cs1=09834bf4-3c67-4795-8d81-8403634f5940; afa6f4b5a41e143f_gr_session_id_09834bf4-3c67-4795-8d81-8403634f5940=true; afa6f4b5a41e143f_gr_cs1=CD15714'
    r = rq.request(
        method='POST',
        url='http://api.k2.haixue.com/wechat/headwork/chanceDetailList/list',
        data=data,
        headers={
            # 'Accept': 'application/json',
            # 'Accept-Encoding': 'gzip, deflate',
            # 'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,it;q=0.7',
            # 'Connection': 'keep-alive',
            # 'Content-Length': '109',
            # 'Content-Type': 'application/json; charset=utf-8',
            # 'Cookie': 'gr_user_id=486c33ca-2c07-4a0a-94e2-666d4db3ee1d; Hm_lvt_a2381ea68b047ac974f8d1977a0ef79e=1661671265; Hm_lvt_3801913c7c5b747b4e315c60418a9308=1661671265,1661699563; zg_did=%7B%22did%22%3A%20%22183400bfc1d204-0b3e5c0466fe51-26021a51-1fa400-183400bfc1edf0%22%7D; zg_9b985b4e163746bcb3e8ae9a6789e00d=%7B%22sid%22%3A%201663226870817%2C%22updated%22%3A%201663226870821%2C%22info%22%3A%201663226870819%2C%22superProperty%22%3A%20%22%7B%5C%22%E5%BA%94%E7%94%A8%E5%90%8D%E7%A7%B0%5C%22%3A%20%5C%22%E5%BE%AE%E4%BF%A1%E5%AD%A6%E4%B9%A0%E5%8D%A1%5C%22%7D%22%2C%22platform%22%3A%20%22%7B%7D%22%2C%22utm%22%3A%20%22%7B%7D%22%2C%22referrerDomain%22%3A%20%22%22%2C%22cuid%22%3A%20%22undefined%22%7D; afa6f4b5a41e143f_gr_last_sent_cs1=CD15714; security_refresh=8780372edff24be7bdb13d6dfb4fc73a.33923643.1677859529851.web.16dec14904359c89244fa14730ecf3cb; x_access_token=eU28d1NezjlFemNIntoyeQrakZd5fKKwbk16as0tPF5ad6sdjlMrW6iD9+apjy3JfUiZQ23FHUEPVam81YjqhOlrlCuaDcOqUyoh+aW41AY=; x-access-token=c/VgnwC8a0VPbPSSCLyPwlBq/hgmSxHc3A4+cB/KcwEV0rMRXv6Cg1c2yOstwNsR0DrBgMBzSehhqNXF0E2ffDQ69p/Eqk02q5arzZ3fnEA=; COOKIE_TICKET=NjQyN2MxMDAxMmI0MDQwMDA2NjA3YjcwLjE4NDU2Mi4xNjgwMzI2OTEyOTMzLjE2ODAzNDg1MTI5MzMuUEMuMDU3MjU3MDIyYmRkZWFkNDU4OGEwMTQxZDk5YzJlNTA=; ul_ticket=NjQyN2MxMDAxMmI0MDQwMDA2NjA3YjcwLjE4NDU2Mi4xNjgwMzI2OTEyOTMzLjE2ODAzNDg1MTI5MzMuUEMuMDU3MjU3MDIyYmRkZWFkNDU4OGEwMTQxZDk5YzJlNTA=; webapi_session_ticket=NjQyN2MxMDAxMmI0MDQwMDA2NjA3YjcwLjE4NDU2Mi4xNjgwMzI2OTEyOTMzLjE2ODAzNDg1MTI5MzMuUEMuMDU3MjU3MDIyYmRkZWFkNDU4OGEwMTQxZDk5YzJlNTA=; webapi_session_ticket=NjQyN2MxMDAxMmI0MDQwMDA2NjA3YjcwLjE4NDU2Mi4xNjgwMzI2OTEyOTMzLjE2ODAzNDg1MTI5MzMuUEMuMDU3MjU3MDIyYmRkZWFkNDU4OGEwMTQxZDk5YzJlNTA=; security_cookie_user=184562; SESSION=NjMyOTc5NzMtOGMzMC00YWZjLWIzZmEtNDAyYjYxZmQ5NWJh; afa6f4b5a41e143f_gr_session_id=09834bf4-3c67-4795-8d81-8403634f5940; afa6f4b5a41e143f_gr_last_sent_sid_with_cs1=09834bf4-3c67-4795-8d81-8403634f5940; afa6f4b5a41e143f_gr_session_id_09834bf4-3c67-4795-8d81-8403634f5940=true; afa6f4b5a41e143f_gr_cs1=CD15714',
            'Host': 'api-k2.haixue.com',
            'Origin': 'http://k2.haixue.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
        },
        # timeout=(5, 10)
    )

    # if r.status_code == 204:
    #     time.sleep(1)
    #     get_list()
    # else:
    #     print(json.loads(r.text))

    # result = json.loads(r.text)
    print(r.text)


if __name__ == '__main__':
    get_list()
