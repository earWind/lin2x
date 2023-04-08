"""
  https://doc.itprojects.cn/0001.zhishi/python.0008.pyqt5rumen/index.html#/README
"""

import sys
import os
import haixue
import time
import images  # 这里是获取图标 images.py
from PyQt5.QtGui import QIcon
from PyQt5.QtWidgets import *
from PyQt5.QtCore import *


class MyWindow(QWidget):
    # 声明一个信号 只能放在函数的外面
    my_signal = pyqtSignal(str)

    def __init__(self):
        super().__init__()
        self.init_ui()
        self.msg_history = list()  # 用来存放消息

    def init_ui(self):
        # 窗口标题
        self.setWindowTitle("hx")

        # 设置图标
        ico_path = ':/hx.png'
        self.setWindowIcon(QIcon(ico_path))

        # 窗口的大小
        self.resize(400, 200)

        # 账号
        account_label = QLabel("账号", self)
        account_label.setGeometry(20, 20, 30, 30)
        account_edit = QLineEdit(self)
        account_edit.setText('CD15714')
        account_edit.setPlaceholderText("请输入账号")
        account_edit.setGeometry(60, 20, 200, 30)
        self.account_edit = account_edit

        # 密码
        password_label = QLabel("密码", self)
        password_label.setGeometry(20, 60, 30, 30)
        password_edit = QLineEdit(self)
        password_edit.setEchoMode(QLineEdit.Password)
        password_edit.setText('@QP888888')
        password_edit.setPlaceholderText("请输入密码")
        password_edit.setGeometry(60, 60, 200, 30)
        self.password_edit = password_edit

        # 在窗口里面添加控件
        btn = QPushButton("确定", self)
        btn.setGeometry(60, 100, 200, 30)
        # 设置按钮的父亲是当前窗口，等于是添加到窗口中显示
        btn.setParent(self)
        # 按钮绑定点击事件
        btn.clicked.connect(self.click_my_btn)

        # 创建一个整体布局器
        container = QVBoxLayout()
        # 用来显示检测到漏洞的信息
        self.msg = QLabel("")
        self.msg.resize(360, 15)
        # print(self.msg.frameSize())
        self.msg.setWordWrap(True)  # 自动换行
        self.msg.setAlignment(Qt.AlignTop)  # 靠上
        # self.msg.setStyleSheet("background-color: yellow; color: black;")

        # 创建一个滚动对象
        scroll = QScrollArea()
        scroll.setWidget(self.msg)

        # 创建垂直布局器，用来添加自动滚动条
        v_layout = QVBoxLayout()
        v_layout.addWidget(scroll)

        # 创建水平布局器
        h_layout = QHBoxLayout()
        h_layout.addStretch(1)  # 伸缩器
        h_layout.addWidget(account_label)
        h_layout.addWidget(account_edit)
        h_layout.addWidget(password_label)
        h_layout.addWidget(password_edit)
        h_layout.addWidget(btn)
        h_layout.addStretch(1)

        # 操作将要显示的控件以及子布局器添加到container
        container.addLayout(v_layout)
        container.addLayout(h_layout)

        # 设置布局器
        self.setLayout(container)

        # 绑定信号和槽
        self.my_signal.connect(self.my_slot)

    def my_slot(self, msg):
        # 更新内容
        print(msg)
        self.msg_history.append(msg)
        self.msg.setText("<br>".join(self.msg_history))
        self.msg.resize(360, self.msg.frameSize().height() + 15)
        self.msg.repaint()  # 更新内容，如果不更新可能没有显示新内容

    def click_my_btn(self, arg):
        # 这里的参数正好是信号发出，传递的参数
        print(arg)

        t = get_now_time()
        self.my_signal.emit('开始时间：' + t)

        account = self.account_edit.text()
        pass_word = self.password_edit.text()
        if account and pass_word:
            try:
                r = haixue.login(account, pass_word)
                if isinstance(r, str):
                    self.my_signal.emit(r)
                else:
                    for i in r:
                        self.my_signal.emit(i['msg'])
            finally:
                t = get_now_time()
                self.my_signal.emit('结束时间：' + t)


def get_now_time():
    return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))


if __name__ == '__main__':
    app = QApplication(sys.argv)
    w = MyWindow()
    w.show()
    app.exec()
    # haixue.login('CD15714', '@QP888888')
