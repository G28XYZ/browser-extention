export const parseData = async (month: number) => {
  if (!month || +month < 1 || +month > 12) {
    console.log("Введите число от 1 до 12");
    return;
  }

  const delay = async (ms = 1000) => {
    return await new Promise((resolve) => {
      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        resolve(true);
      }, ms);
    });
  };

  const iframeDoc = document.querySelector<HTMLIFrameElement>("iframe").contentWindow?.document;
  const getTable = () => iframeDoc && iframeDoc.querySelector("#timesheet_table table");
  const getBtns = () =>
    iframeDoc && iframeDoc.querySelectorAll<HTMLElement>("#timesheet_navigation .timesheet-icon-button");

  let isOutOfDate = false;
  let clickedNext = 0;
  let clickedPrev = 0;
  let isTableLoading = false;

  (async () => {
    while (!isOutOfDate) {
      await delay(100);
      const isImg = iframeDoc.querySelector("#timesheet_table img");
      isTableLoading = Boolean(isImg);
    }
  })();

  const result = {};

  const checkCorrectDate = (date = "") => {
    return +date.split(".").at(-1) === +month;
  };

  const onCheckIsStartOfDate = (dates: string[]) => {
    return dates.some((date) => +date.split(".").at(-1) < +month);
  };

  const onCheckIsEndOfDate = (dates: string[]) => {
    return dates.some((date) => +date.split(".").at(-1) > +month);
  };

  const onClickNext = async () => {
    let isLoading = true;

    const checkFn = () => {
      const table = getTable();
      const hasTable = Boolean(table);
      if (hasTable) {
        const theadCells = Array.from(table?.querySelectorAll("thead td")).map((item) => item.textContent);
        isOutOfDate = onCheckIsEndOfDate(Array.from(theadCells).slice(1, 8));
        isLoading = false;
      }
      return isOutOfDate;
    };
    while (!isOutOfDate && isLoading) {
      await delay();

      if (!isTableLoading) {
        const [_, nextBtn] = getBtns();
        if (nextBtn && !checkFn()) {
          nextBtn?.click();
          ++clickedNext;
        }
      }
    }
    return clickedNext < 10;
  };

  const onClickPrev = async () => {
    let isLoading = true;
    const checkFn = () => {
      const table = getTable();
      const hasTable = Boolean(table);
      if (hasTable) {
        const theadCells = Array.from(table?.querySelectorAll("thead td")).map((item) => item.textContent);
        isLoading = onCheckIsStartOfDate(theadCells.slice(1, 8)) === false;
      }
      return isLoading;
    };
    checkFn();
    while (!isOutOfDate && isLoading) {
      await delay();
      if (!isTableLoading) {
        const [prevBtn] = getBtns();
        if (prevBtn && checkFn()) {
          prevBtn?.click();
          ++clickedPrev;
        }
        clickedPrev > 10 && !isLoading && (isLoading = false);
      }
    }
  };

  await onClickPrev();

  const toJson = async () => {
    const table = getTable();
    const theadCells = table?.querySelectorAll("thead td");
    Array.from(table?.querySelectorAll("tbody tr") || []).map((item) => {
      const cells = Array.from(item.querySelectorAll("td"));
      if (cells?.length) {
        const workElementKey = cells[0]?.textContent;
        if (workElementKey) {
          const [_, taskNumber, status, title] = workElementKey
            .match(/(\d+\s+):(\s+\w+\s+):(\s+.*)/)
            .map((str) => str?.trim());
          const createDayItem = (elem: HTMLTableCellElement, idx) => {
            const date = `${theadCells[idx + 1]?.textContent}`;
            const time = (elem?.firstChild as HTMLInputElement)?.value || "";
            if (!time || !checkCorrectDate(date)) return null;
            return {
              status,
              title,
              taskNumber,
              date,
              time,
            };
          };
          const data = cells?.slice(1, 8)?.map(createDayItem);
          result[taskNumber] = result[taskNumber] ? result[taskNumber].concat(data) : data;
        }
      }
    });
    !isOutOfDate && (await onClickNext()) && (await toJson());
  };

  await toJson();

  for (const key in result) {
    result[key] = result[key].filter((item) => Boolean(item));
  }

  console.log(result);

  return JSON.stringify(result);
};

export const downLoad = (data: string, month: number, year = new Date().getFullYear()) => {
  const filename = `Месячный отчет_${month}.${year}_${new Date().getTime()}.json`;
  const link = document.createElement("a");
  link.style.display = "none";
  link.setAttribute("target", "_blank");
  link.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(data));
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
