const tag = `draftbot`;

const composeTime: () => string = () => {
  const now = new Date();

  const day =
    now.getDate().toString().length < 2 ? `0${now.getDate()}` : now.getDate();
  const month =
    now.getMonth().toString().length < 2
      ? `0${now.getMonth() + 1}`
      : now.getMonth() + 1;
  const year = now.getFullYear();

  const hours =
    now.getHours().toString().length < 2
      ? `0${now.getHours()}`
      : now.getHours();
  const minutes =
    now.getMinutes().toString().length < 2
      ? `0${now.getMinutes()}`
      : now.getMinutes();
  const seconds =
    now.getSeconds().toString().length < 2
      ? `0${now.getSeconds()}`
      : now.getSeconds();
  const miliseconds = () => {
    if (now.getMilliseconds().toString().length === 2) {
      return `0${now.getMilliseconds()}`;
    } else if (now.getMilliseconds().toString().length === 1) {
      return `00${now.getMilliseconds()}`;
    }

    return now.getMilliseconds();
  };

  return `[${day}/${month}/${year} ${hours}:${minutes}:${seconds}.${miliseconds()}]`;
};

const composeService: (data: string) => string = (data: string) => {
  if (data) {
    const size = data.length;
    const max = 32;

    if (size < max) {
      for (let i = 0; i < max - size; i++) {
        data = `${data}_`;
      }
      return data;
    }
    return data;
  }

  return data;
};

const composeState: (
  data: "error" | "success" | "warning" | "start" | null
) => string = (data: "error" | "success" | "warning" | "start" | null) => {
  switch (data) {
    case "error":
      return "[ ERROR ]";
    case "success":
      return "[SUCCESS]";
    case "warning":
      return "[WARNING]";
    case "start":
      return "[ START ]";
    default:
      return "[ INFOS ]";
  }
};

export const logs: (
  state: "error" | "success" | "warning" | "start" | null,
  service: string,
  content: string,
  guild?: string
) => void = async (
  state: "error" | "success" | "warning" | "start" | null,
  service: string,
  content: string,
  guild?: string
) => {
  if (guild) {
    console.log(
      `${composeTime()}[${tag}]${composeState(state)}[${composeService(
        service
      )}][${guild}] » ${content}`
    );
  } else {
    console.log(
      `${composeTime()}[${tag}]${composeState(state)}[${composeService(
        service
      )}] » ${content}`
    );
  }
};
