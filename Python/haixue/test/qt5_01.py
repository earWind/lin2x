import sys
from PyQt5.QtCore import QThread, pyqtSignal
from PyQt5.QtWidgets import QApplication, QMainWindow, QProgressDialog, QPushButton
import time


class CalculationThread(QThread):
    progress_signal = pyqtSignal(int)

    def __init__(self):
        super().__init__()

    def run(self):
        for i in range(101):
            time.sleep(100000)
            self.progress_signal.emit(i)


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setGeometry(100, 100, 400, 300)
        self.setWindowTitle('PyQt5 Wait Dialog')

        self.button = QPushButton('Start Calculation', self)
        self.button.move(150, 100)
        self.button.clicked.connect(self.start_calculation)

        self.show()

    def start_calculation(self):
        dialog = QProgressDialog('Calculating...', 'Cancel', 0, 100, self)
        dialog.setWindowModality(2)
        dialog.show()

        thread = CalculationThread()
        thread.progress_signal.connect(dialog.setValue)
        thread.start()


if __name__ == '__main__':
    app = QApplication([])
    window = MainWindow()
    sys.exit(app.exec_())
