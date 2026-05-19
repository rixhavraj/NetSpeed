#include "utils/Formatter.h"

#include <iomanip>
#include <sstream>

std::wstring Formatter::FormatBytesPerSecond(std::uint64_t bytesPerSecond)
{
    std::wostringstream stream;
    stream.imbue(std::locale::classic());
    stream << std::fixed << std::setprecision(2);

    double val = static_cast<double>(bytesPerSecond);

    if (val < 1024.0) {
        stream << val << L" B/s";
    } else if (val < 1048576.0) {
        stream << (val / 1024.0) << L" KB/s";
    } else if (val < 1073741824.0) {
        stream << (val / 1048576.0) << L" MB/s";
    } else {
        stream << (val / 1073741824.0) << L" GB/s";
    }

    return stream.str();
}
