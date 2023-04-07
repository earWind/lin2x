import sys
import os
from PyQt5.QtGui import QIcon
from PyQt5.QtWidgets import QApplication, QWidget, QPushButton, QLabel, QLineEdit


class MyWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.init_ui()

    def init_ui(self):
        # 窗口标题
        self.setWindowTitle("hx")

        # 设置图标
        ico_path = os.path.join(os.path.dirname(__file__), 'hx.png')
        self.setWindowIcon(QIcon(ico_path))

        # 窗口的大小
        self.resize(300, 200)

        # 账号
        account_label = QLabel("账号", self)
        account_label.setGeometry(20, 20, 30, 30)
        account_edit = QLineEdit(self)
        account_edit.setPlaceholderText("请输入账号")
        account_edit.setGeometry(60, 20, 200, 30)
        self.account_edit = account_edit

        # 密码
        password_label = QLabel("密码", self)
        password_label.setGeometry(20, 60, 30, 30)
        password_edit = QLineEdit(self)
        password_edit.setEchoMode(QLineEdit.Password)
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

    def click_my_btn(self, arg):
        # 这里的参数正好是信号发出，传递的参数
        print(arg)
        print(self.account_edit.text())
        print(self.password_edit.text())


if __name__ == '__main__':
    app = QApplication(sys.argv)
    w = MyWindow()
    w.show()
    app.exec()
