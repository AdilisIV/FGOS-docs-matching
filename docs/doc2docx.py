# Convert Microsoft Word 'doc' files to 'docx' format by opening and
# saving Word files using win32com to automate Microsoft Word.
#
# The script walks a directory structure and converts all '.doc' files found.
# Original 'doc' and new 'docx' files are saved in the same directory.
#
# This Word automation method has been found to work where OFC.exe and
# wordconv.exe do not.
#
# Tested using Windows 7, Word 2013, python 2.7.10, pywin32-219.win-amd64-py2.7
# We need to test this with 64bit arch, and Office 365


# https://stackoverflow.com/questions/23864234/importerror-no-module-named-win32com-client
# https://github.com/extrabacon/python-shell



# import os.path
# import win32com.client

# baseDir = 'docs' # Starting directory for directory walk

# word = win32com.client.Dispatch("Word.application")

# for dir_path, dirs, files in os.walk(baseDir):
# 	for file_name in files:
# 		file_path = os.path.join(dir_path, file_name)
# 		file_name, file_extension = os.path.splitext(file_path)
# 		if file_extension.lower() == '.doc': #
# 			docx_file = '{0}{1}'.format(file_path, 'x')
# 			if not os.path.isfile(docx_file): # Skip conversion where docx file already exists
# 				print('Converting: {0}'.format(file_path))
# 				try:
# 					wordDoc = word.Documents.Open(file_path, False, False, False)
# 					wordDoc.SaveAs2(docx_file, FileFormat = 16)
# 					wordDoc.Close()
# 				except Exception:
# 					print('Failed to Convert: {0}'.format(file_path))

# word.Quit()